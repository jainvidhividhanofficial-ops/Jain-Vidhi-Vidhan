import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

// Direct REST helper — bypasses SDK lazy-execution quirks
async function updateBookingStatus(
    bookingId: string,
    fields: Record<string, any>
): Promise<{ ok: boolean; data: any; error: string | null }> {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        },
        body: JSON.stringify(fields),
    });
    const data = await res.json();
    return { ok: res.ok, data, error: res.ok ? null : JSON.stringify(data) };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        let text = '';
        let chatId = 0;

        // 1. Button press (inline keyboard)
        if (body.callback_query) {
            // callback_data: "ACCEPT_<uuid>" or "REJECT_<uuid>"
            // Replace only the FIRST underscore to get "ACCEPT <uuid>"
            text = body.callback_query.data.replace('_', ' ');
            chatId = body.callback_query.message.chat.id;

            // Acknowledge — stops the spinner on the button
            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: body.callback_query.id })
            });
        }
        // 2. Plain text message
        else if (body.message?.text) {
            text = body.message.text.trim();
            chatId = body.message.chat.id;
        } else {
            return NextResponse.json({ ok: true });
        }

        // Parse e.g. "ACCEPT d4804469-..." or "REJECT d4804469-..."
        const parts = text.trim().split(' ');
        if (parts.length < 2) return NextResponse.json({ ok: true });

        const action = parts[0].toUpperCase();
        const bookingId = parts[1];

        if (action !== 'ACCEPT' && action !== 'REJECT') {
            return NextResponse.json({ ok: true });
        }

        console.log(`[Webhook] action=${action} bookingId=${bookingId} chatId=${chatId}`);

        // ── Fetch provider name to personalize the message ───────────────
        let provider: any = null;
        const { data: pList } = await supabaseAdmin
            .from('providers')
            .select('*');
        if (pList && pList.length > 0) {
            // Because we aren't mapping by telegram_chat_id, just randomly select one for the interaction
            provider = pList[Math.floor(Math.random() * pList.length)];
        }
        const providerName = provider?.providername || 'Provider';

        // ── Fetch Booking ──────────────────────────────────────────
        const { data: booking, error: bErr } = await supabaseAdmin
            .from('bookings')
            .select('id, status, provider_id, user_name, user_phone, location, service_name, booking_date, booking_time')
            .eq('id', bookingId)
            .single();

        if (bErr || !booking) {
            console.error('[Webhook] Booking not found:', bookingId, bErr?.message);
            await sendReply(botToken, chatId, `❌ Booking not found: \`${bookingId}\``);
            return NextResponse.json({ ok: true });
        }

        if (booking.status !== 'pending') {
            await sendReply(botToken, chatId, `ℹ️ Booking is already *${booking.status}*. No action needed.`);
            return NextResponse.json({ ok: true });
        }

        // ════════════════════════════════════════
        //  ACCEPT → status = 'assigned'
        // ════════════════════════════════════════
        if (action === 'ACCEPT') {
            // Use direct REST PATCH — update status only (provider_id type may differ)
            const { ok, data: updated, error: uErr } = await updateBookingStatus(bookingId, {
                status: 'assigned',
            });

            console.log('[Webhook] ACCEPT update result:', JSON.stringify(updated), 'ok:', ok, 'error:', uErr);

            if (!ok) {
                await sendReply(botToken, chatId, `❌ Error updating booking: ${uErr}`);
            } else {
                await sendReply(botToken, chatId,
                    `✅ *Booking Confirmed!*\n\n` +
                    `Assigned to you, *${providerName}*.\n\n` +
                    `📞 *Client Details:*\n` +
                    `👤 ${booking.user_name}\n` +
                    `📱 ${booking.user_phone}\n` +
                    `🏠 ${booking.location}\n\n` +
                    `🛕 ${booking.service_name}\n` +
                    `📅 ${booking.booking_date} | ⏰ ${booking.booking_time}\n\n` +
                    `🙏 _Please contact the client to confirm details._`
                );
            }
        }

        // ════════════════════════════════════════
        //  REJECT → pick next provider, re-send
        // ════════════════════════════════════════
        else if (action === 'REJECT') {
            await sendReply(botToken, chatId,
                `ℹ️ *Rejection noted.* The booking will be reassigned to another provider.`);

            console.log(`[Webhook] REJECT by ${providerName} (id:${provider?.id})`);

            // Fetch all providers, exclude the rejecting one
            const { data: allProviders } = await supabaseAdmin
                .from('providers')
                .select('*');

            // ── Testing mode: Do not exclude by telegram_chat_id because we are testing in 1 room
            let remaining = allProviders || [];
            if (provider && remaining.length > 1) {
                // Exclude the specific provider who rejected it by ID (if we successfully queried them)
                remaining = remaining.filter((p: any) => p.id !== provider.id);
            }

            if (remaining.length === 0) {
                // No one left — mark unassigned
                await supabaseAdmin
                    .from('bookings')
                    .update({ status: 'unassigned' })
                    .eq('id', bookingId);
                console.warn('[Webhook] No more providers for booking', bookingId);
                return NextResponse.json({ ok: true });
            }

            // Pick next randomly
            const next = remaining[Math.floor(Math.random() * remaining.length)] as any;
            
            // As requested for testing: Force the message to the same chat room
            const nextChatId = String(chatId) || '756584541'; 
            const nextName = next.providername || 'Provider';

            // Send new notification
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: nextChatId,
                    text:
                        `🛕 *New Booking Request*\n\n` +
                        `Hello ${nextName},\n\n` +
                        `*Service:* ${booking.service_name}\n` +
                        `*Date:* ${booking.booking_date}\n` +
                        `*Time:* ${booking.booking_time}\n` +
                        `*Location:* ${booking.location}\n\n` +
                        `*Booking ID:* \`${bookingId}\`\n\n` +
                        `_Client details will be shared once you accept the booking._`,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '✅ Accept Booking', callback_data: `ACCEPT_${bookingId}` },
                            { text: '❌ Reject', callback_data: `REJECT_${bookingId}` }
                        ]]
                    }
                }),
            });

            // Update booking: keep status=pending (just re-dispatching)
            const { ok: rdOk, data: reDispatched, error: rdErr } = await updateBookingStatus(bookingId, {
                status: 'pending',
            });

            console.log('[Webhook] Re-dispatch update:', JSON.stringify(reDispatched), 'ok:', rdOk, 'error:', rdErr);
        }

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        console.error('[Webhook] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function sendReply(token: string | undefined, chatId: number, text: string) {
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
        });
    } catch (e: any) {
        console.error('[sendReply] error:', e.message);
    }
}
