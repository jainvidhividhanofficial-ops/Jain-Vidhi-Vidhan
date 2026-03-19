
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const bookingData = await request.json();

        // 1. Insert the booking into Supabase
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .insert([{
                user_name: bookingData.name,
                user_phone: bookingData.phone,
                service_name: bookingData.serviceName,
                service_type: bookingData.serviceType,
                booking_date: bookingData.date,
                booking_time: bookingData.time || 'TBD',
                location: `${bookingData.city ? `[${bookingData.city}] ` : ''}${bookingData.address}`,
                notes: bookingData.instructions,
                status: 'pending'
            }])
            .select()
            .single();

        if (bookingError) throw bookingError;

        // 2. Fetch all providers
        const { data: providers } = await supabaseAdmin
            .from('providers')
            .select('*');

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            console.error('TELEGRAM_BOT_TOKEN is not set!');
            return NextResponse.json({ success: true, bookingId: booking.id, warning: 'Telegram token missing' });
        }

        // 3. Select a random provider
        let selectedProvider: any = null;
        if (providers && providers.length > 0) {
            selectedProvider = providers[Math.floor(Math.random() * providers.length)];
        }

        // Get the telegram chat_id — use provider's column if it exists, else fallback to demo ID
        const chatId = selectedProvider?.telegram_chat_id
            ? String(selectedProvider.telegram_chat_id)
            : '756584541'; // Demo fallback until telegram_chat_id is added to providers table

        const providerName = selectedProvider?.providername
            || selectedProvider?.name
            || 'Provider';

        // Note: provider_id update skipped — providers.id is integer
        // but bookings.provider_id is UUID (type mismatch).
        // Status tracking (pending → assigned) is done via the webhook.

        // 5. Build and send Telegram message
        const message =
            `🛕 *New Booking Request*\n\n` +
            `Hello ${providerName},\n\n` +
            `*Service:* ${booking.service_name}\n` +
            `*Date:* ${booking.booking_date}\n` +
            `*Time:* ${booking.booking_time}\n` +
            `*Location:* ${booking.location}\n\n` +
            `*Booking ID:* \`${booking.id}\`\n\n` +
            `_Client details will be shared once you accept the booking._`;

        const telegramRes = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '✅ Accept Booking', callback_data: `ACCEPT_${booking.id}` },
                            { text: '❌ Reject', callback_data: `REJECT_${booking.id}` }
                        ]]
                    }
                }),
            }
        );

        const telegramJson = await telegramRes.json();
        console.log(`Telegram send → chat:${chatId} | ok:${telegramJson.ok}`, telegramJson.ok ? '' : telegramJson.description);

        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            telegramOk: telegramRes.ok,
        });

    } catch (error: any) {
        console.error('Booking API Error:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
