// Server-only. Verifies Shopify's App Proxy request signature so this route
// can't be called by anyone who simply discovers the app's public URL —
// only requests actually forwarded through the shop's App Proxy carry a
// valid signature. See:
// https://shopify.dev/docs/apps/build/online-store/display-dynamic-data#verify-the-request

import crypto from 'crypto';

export function verifyAppProxySignature(searchParams: URLSearchParams): boolean {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    throw new Error('SHOPIFY_API_SECRET is not set. See .env.local.example.');
  }

  const signature = searchParams.get('signature');
  if (!signature) return false;

  const keys = Array.from(new Set(searchParams.keys()))
    .filter((key) => key !== 'signature')
    .sort();
  const message = keys.map((key) => `${key}=${searchParams.getAll(key).join(',')}`).join('');

  const digest = crypto.createHmac('sha256', secret).update(message).digest('hex');

  const digestBuffer = Buffer.from(digest, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');
  if (digestBuffer.length !== signatureBuffer.length) return false;
  return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
}
