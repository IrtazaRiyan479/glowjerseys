// Server-only. Fetches and caches a Shopify Admin API access token via the
// client_credentials OAuth grant. Never import this from a client component.

const REFRESH_MARGIN_MS = 60_000;

type CachedToken = { accessToken: string; expiresAt: number };

let cached: CachedToken | null = null;
let pending: Promise<string> | null = null;

function getStoreDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not set. See .env.local.example.');
  }
  return domain;
}

async function fetchAccessToken(): Promise<CachedToken> {
  const clientId = process.env.SHOPIFY_API_KEY;
  const clientSecret = process.env.SHOPIFY_API_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('SHOPIFY_API_KEY / SHOPIFY_API_SECRET are not set. See .env.local.example.');
  }

  const res = await fetch(`https://${getStoreDomain()}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Shopify admin token request failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - REFRESH_MARGIN_MS,
  };
}

export async function getAdminAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.accessToken;
  }
  if (!pending) {
    pending = fetchAccessToken()
      .then((token) => {
        cached = token;
        return token.accessToken;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}
