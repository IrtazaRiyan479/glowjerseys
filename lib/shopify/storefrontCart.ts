// Client-side only. Talks to Shopify's storefront Ajax Cart API (/cart.js,
// /cart/change.js), which only resolves to the real cart when this page is
// loaded through the Shopify App Proxy (same-origin as the storefront) —
// on the standalone deployment domain these calls fail/404 as expected.

export type StorefrontCartItem = {
  key: string;
  variant_id: number;
  product_title: string;
  variant_title: string | null;
  quantity: number;
  price: number; // cents
  line_price: number; // cents
  image: string | null;
  url: string;
  properties: Record<string, string> | null;
};

export async function fetchStorefrontCart(): Promise<StorefrontCartItem[]> {
  try {
    const res = await fetch('/cart.js', { cache: 'no-store' });
    if (!res.ok) return [];
    const cart = await res.json();
    return (cart.items ?? []) as StorefrontCartItem[];
  } catch {
    return [];
  }
}

export async function addToStorefrontCart(
  variantId: number,
  quantity: number,
  properties: Record<string, string>
): Promise<StorefrontCartItem[]> {
  const res = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: variantId, quantity, properties }] }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to add to cart: ${body || res.status}`);
  }
  // /cart/add.js's own response only describes the added line, not the full
  // cart — re-fetch so callers get back the authoritative current state.
  return fetchStorefrontCart();
}

export async function updateStorefrontCartNote(note: string): Promise<void> {
  const res = await fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    throw new Error('Failed to save order note.');
  }
}

export async function updateStorefrontCartItem(
  key: string,
  quantity: number
): Promise<StorefrontCartItem[]> {
  const res = await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: Math.max(0, quantity) }),
  });
  if (!res.ok) {
    throw new Error('Failed to update cart.');
  }
  const cart = await res.json();
  return (cart.items ?? []) as StorefrontCartItem[];
}
