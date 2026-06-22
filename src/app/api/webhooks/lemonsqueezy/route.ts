import crypto from 'node:crypto';
import { processWebhookEvent, storeWebhookEvent } from '@/actions/webhooks';
import { webhookHasMeta } from '@/lib/typeguards';

export async function POST(request: Request) {
  // console.log('Received Lemon Squeezy webhook request.');
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return new Response('Lemon Squeezy Webhook Secret not set in .env', {
      status: 500,
    });
  }

  // First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(
    request.headers.get('X-Signature') || '',
    'utf8',
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error('Invalid signature.');
  }

  const data = JSON.parse(rawBody) as unknown;
  // console.log('Lemon Squeezy webhook received:', data);

  // Type guard to check if the object has a 'meta' property.
  if (webhookHasMeta(data)) {
    const webhookEventId = await storeWebhookEvent(data.meta.event_name, data);

    // Process synchronously so Vercel doesn't terminate the function before crediting.
    try {
      await processWebhookEvent(webhookEventId);
    } catch (err) {
      console.error('processWebhookEvent failed:', err);
      // Return 500 so LS retries the webhook.
      return new Response('Processing failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  }

  return new Response('Data invalid', { status: 400 });
}
