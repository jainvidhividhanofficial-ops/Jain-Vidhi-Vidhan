/**
 * set-webhook.js
 * 
 * Helper script to set or remove the Telegram Webhook URL.
 * 
 * Usage:
 *   node scripts/set-webhook.js https://your-vercel-domain.vercel.app/api/telegram-webhook
 *   node scripts/set-webhook.js remove
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const env = {};
try {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const i = line.indexOf('=');
        if (i > 0) {
            const k = line.slice(0, i).trim();
            const v = line.slice(i + 1).trim();
            if (k && v) env[k] = v;
        }
    });
} catch (e) {
    console.warn('.env.local not found, proceeding with system env vars');
}

const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN is missing!');
    process.exit(1);
}

const arg = process.argv[2];

if (!arg) {
    console.log(`
Usage:
  To set webhook:    node scripts/set-webhook.js https://your-vercel-domain.vercel.app/api/telegram-webhook
  To remove webhook: node scripts/set-webhook.js remove

Note: If you want to use bot-poller.js locally, you must "remove" the webhook first!
If you want the webhook to work on Vercel, you must *stop* bot-poller.js and set the webhook to your Vercel URL.
`);
    process.exit(0);
}

let urlPath = '';
if (arg === 'remove') {
    urlPath = `/bot${BOT_TOKEN}/deleteWebhook`;
    console.log('Removing webhook...');
} else {
    urlPath = `/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(arg)}`;
    console.log(`Setting webhook to: ${arg}`);
}

const req = https.request({
    hostname: 'api.telegram.org',
    path: urlPath,
    method: 'GET'
}, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        const json = JSON.parse(d);
        if (json.ok) {
            console.log('✅ Success:', json.description);
        } else {
            console.error('❌ Error:', json.description);
        }
    });
});

req.on('error', e => console.error('Request error:', e.message));
req.end();
