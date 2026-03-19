/**
 * bot-poller.js
 *
 * Polls Telegram for ACCEPT/REJECT button presses and updates Supabase.
 * Uses native Node.js `https` module — avoids the fetch() ETIMEDOUT issue
 * that happens when running locally on networks that block undici/fetch.
 *
 * Run:  node scripts/bot-poller.js
 * Or:   npm run bot
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Load .env.local ───────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '../.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const i = line.indexOf('=');
    if (i > 0) {
        const k = line.slice(0, i).trim();
        const v = line.slice(i + 1).trim();
        if (k && v) env[k] = v;
    }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BOT_TOKEN   = env.TELEGRAM_BOT_TOKEN;

if (!SUPABASE_URL || !SUPABASE_KEY || !BOT_TOKEN) {
    console.error('❌ Missing env vars. Check .env.local');
    process.exit(1);
}

const SUPABASE_HOST = new URL(SUPABASE_URL).hostname;
let lastUpdateId = 0;

// ── Native HTTPS helper ───────────────────────────────────────────────────────
function req(options, bodyStr) {
    return new Promise((resolve, reject) => {
        const r = https.request(options, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
                catch { resolve({ status: res.statusCode, body: d }); }
            });
        });
        r.on('error', reject);
        r.setTimeout(15000, () => { r.destroy(new Error('Request timeout')); });
        if (bodyStr) r.write(bodyStr);
        r.end();
    });
}

// ── Supabase REST ─────────────────────────────────────────────────────────────
function dbGet(table, qs) {
    return req({
        hostname: SUPABASE_HOST,
        path: `/rest/v1/${table}?${qs}`,
        method: 'GET',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
}

function dbPatch(table, qs, fields) {
    const body = JSON.stringify(fields);
    return req({
        hostname: SUPABASE_HOST,
        path: `/rest/v1/${table}?${qs}`,
        method: 'PATCH',
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Prefer: 'return=representation',
        }
    }, body);
}

// ── Telegram helpers ──────────────────────────────────────────────────────────
function tg(method, data) {
    const body = JSON.stringify(data);
    return req({
        hostname: 'api.telegram.org',
        path: `/bot${BOT_TOKEN}/${method}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
        }
    }, body);
}

async function reply(chatId, text) {
    try { await tg('sendMessage', { chat_id: chatId, text, parse_mode: 'Markdown' }); }
    catch (e) { console.error('reply error:', e.message); }
}

// ── Handle ACCEPT / REJECT ────────────────────────────────────────────────────
async function handle(chatId, text) {
    const parts = text.trim().split(' ');
    if (parts.length < 2) return;

    const action   = parts[0].toUpperCase();
    const bookingId = parts[1];

    if (action !== 'ACCEPT' && action !== 'REJECT') return;

    console.log(`[${action}] booking=${bookingId} chatId=${chatId}`);

    // Fetch booking
    const bkRes = await dbGet('bookings',
        `id=eq.${bookingId}&select=id,status,user_name,user_phone,location,service_name,booking_date,booking_time`);
    const bookings = Array.isArray(bkRes.body) ? bkRes.body : [];
    if (!bookings.length) { console.error('Booking not found:', bookingId); return; }
    const bk = bookings[0];

    if (bk.status !== 'pending') {
        await reply(chatId, `ℹ️ Booking is already *${bk.status}*. No action needed.`);
        return;
    }

    // ── Fetch provider name to personalize the ACCEPT message ───────────────
    let assignedProviderName = 'Provider';
    let assignedProviderId = null;
    
    // Instead of mapping by telegram_chat_id, just fetch a random provider for the ACCEPT message
    const pvNameRes = await dbGet('providers', 'select=*');
    if (pvNameRes.body && Array.isArray(pvNameRes.body) && pvNameRes.body.length > 0) {
        const randomPv = pvNameRes.body[Math.floor(Math.random() * pvNameRes.body.length)];
        assignedProviderName = randomPv.providername || 'Provider';
        assignedProviderId = randomPv.id;
    }


    // ── ACCEPT ────────────────────────────────────────────────────────────────
    if (action === 'ACCEPT') {
        // Only update status — skip provider_id (type mismatch: providers.id=int, bookings.provider_id=uuid)
        const patch = await dbPatch('bookings', `id=eq.${bookingId}`, { status: 'assigned' });
        console.log(`✅ ACCEPT DB update HTTP ${patch.status}:`, JSON.stringify(patch.body));

        if (patch.status >= 200 && patch.status < 300) {
            await reply(chatId,
                `✅ *Booking Confirmed!*\n\n` +
                `Assigned to you, *${assignedProviderName}*.\n\n` +
                `🛕 Service: ${bk.service_name}\n` +
                `📅 Date: ${bk.booking_date} | ⏰ Time: ${bk.booking_time}\n\n` +
                `📞 *Client Contact:*\n` +
                `👤 ${bk.user_name}\n` +
                `📱 ${bk.user_phone}\n` +
                `🏠 ${bk.location}\n\n` +
                `🙏 _Please contact the client to confirm details._`
            );
        } else {
            await reply(chatId, `❌ Could not update booking. Please try again.`);
        }
        return;
    }

    // ── REJECT ────────────────────────────────────────────────────────────────
    await reply(chatId, `ℹ️ *Rejection noted.* Reassigning to another provider...`);
    console.log(`❌ REJECT booking=${bookingId}`);

    // Fetch all providers to pick next one
    const pvRes = await dbGet('providers', 'select=*');
    const all   = Array.isArray(pvRes.body) ? pvRes.body : [];

    let remaining = all;
    if (all.length > 1 && assignedProviderId !== null) {
        remaining = all.filter(p => p.id !== assignedProviderId);
    }

    if (remaining.length === 0) {
        console.warn('No other providers available in DB');
        await dbPatch('bookings', `id=eq.${bookingId}`, { status: 'unassigned' });
        await reply(chatId, `ℹ️ No other providers are available. The booking remains unassigned.`);
        return;
    }

    // Pick randomly from the remaining providers
    const next     = remaining[Math.floor(Math.random() * remaining.length)];
    
    // As requested: Force the new message to go to the SAME chat room that rejected it for testing
    const nextChat = chatId || '756584541'; 
    const nextName = next.providername || 'Provider';

    // Keep status = 'pending' for the next provider
    const rd = await dbPatch('bookings', `id=eq.${bookingId}`, { status: 'pending' });
    console.log(`🔄 Re-dispatch DB update HTTP ${rd.status}`);

    // Send notification to next provider
    await tg('sendMessage', {
        chat_id: nextChat,
        text:
            `🛕 *New Booking Request*\n\n` +
            `Hello ${nextName},\n\n` +
            `*Service:* ${bk.service_name}\n` +
            `*Date:* ${bk.booking_date}\n` +
            `*Time:* ${bk.booking_time}\n` +
            `*Location:* ${bk.location}\n\n` +
            `*Booking ID:* \`${bookingId}\`\n\n` +
            `_Client details will be shared once you accept the booking._`,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: '✅ Accept Booking', callback_data: `ACCEPT_${bookingId}` },
                { text: '❌ Reject',         callback_data: `REJECT_${bookingId}` },
            ]]
        }
    });

    console.log(`📤 Notification sent to ${nextName} (chatId: ${nextChat})`);
}

// ── Long-poll loop ────────────────────────────────────────────────────────────
async function poll() {
    try {
        const res = await req({
            hostname: 'api.telegram.org',
            path: `/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=10`,
            method: 'GET',
            headers: {},
        });

        const data = res.body;
        if (data && data.ok && Array.isArray(data.result) && data.result.length > 0) {
            for (const update of data.result) {
                lastUpdateId = update.update_id;

                if (update.callback_query) {
                    const chatId  = update.callback_query.message.chat.id;
                    const raw     = update.callback_query.data; // "ACCEPT_<uuid>" or "REJECT_<uuid>"
                    const parsed  = raw.replace('_', ' ');      // "ACCEPT <uuid>"
                    console.log(`🔘 Button: "${raw}" from chatId ${chatId}`);

                    // Acknowledge so the spinner stops on the button
                    try {
                        await tg('answerCallbackQuery', { callback_query_id: update.callback_query.id });
                    } catch (e) { /* ignore ack errors */ }

                    await handle(chatId, parsed);

                } else if (update.message && update.message.text) {
                    const chatId = update.message.chat.id;
                    const text   = update.message.text.trim();
                    console.log(`📩 Text: "${text}" from chatId ${chatId}`);
                    await handle(chatId, text);
                }
            }
        }
    } catch (err) {
        // Network errors (ETIMEDOUT etc.) — log briefly and retry
        if (err.message && err.message.includes('timeout')) {
            process.stdout.write('.'); // quiet dot instead of full error
        } else {
            console.error('Poll error:', err.message);
        }
    }

    setTimeout(poll, 1000);
}

async function startPoller() {
    console.log('🚀 Bot Poller starting (native https)');
    console.log(`   Supabase: ${SUPABASE_HOST}`);
    
    // Auto-delete webhook to prevent conflicts during local long-polling
    try {
        console.log('   Ensuring webhook is removed for local development...');
        const res = await req({
            hostname: 'api.telegram.org',
            path: `/bot${BOT_TOKEN}/deleteWebhook`,
            method: 'GET',
            headers: {}
        });
        if (res.body && res.body.ok) {
            console.log('   ✅ Webhook removed. Safe to poll locally.');
        } else {
            console.log('   ⚠️ Could not remove webhook:', res.body?.description);
        }
    } catch (e) {
        console.log('   ⚠️ Error clearing webhook:', e.message);
    }
    
    console.log('   Listening for ACCEPT / REJECT...');
    console.log('   Note: requires outbound access to api.telegram.org:443\n');
    poll();
}

startPoller();
