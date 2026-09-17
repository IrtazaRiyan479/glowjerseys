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
