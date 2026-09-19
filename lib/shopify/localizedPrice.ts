const PRODUCT_HANDLE =
  process.env.NEXT_PUBLIC_PRODUCT_HANDLE || "custom-jersey";

export type LocalizedProduct = {
  currency: string;
  // Variant id -> price in cents, matching /cart.js and /products/*.js.
  pricesByVariantId: Record<number, number>;
};

export async function fetchLocalizedProduct(): Promise<LocalizedProduct | null> {
  try {
    const [productRes, cartRes] = await Promise.all([
      fetch(`/products/${PRODUCT_HANDLE}.js`, { cache: "no-store" }),
      fetch("/cart.js", { cache: "no-store" }),
    ]);
    if (!productRes.ok || !cartRes.ok) return null;

    const product = await productRes.json();
    const cart = await cartRes.json();

    const pricesByVariantId: Record<number, number> = {};
    for (const variant of product.variants ?? []) {
      pricesByVariantId[variant.id] = variant.price;
    }
    return { currency: cart.currency, pricesByVariantId };
  } catch {
    return null;
  }
}

// Splits a formatted price into currency symbol / whole / fraction parts, so
// callers can keep a "big whole number, small cents" layout while still
// showing the right symbol for the right currency ($164.99 vs CA$235.00).
export function formatPriceParts(amount: number, currency: string) {
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).formatToParts(amount);

  const symbol = parts.find((p) => p.type === "currency")?.value ?? "$";
  const whole = parts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("");
  const fraction = parts.find((p) => p.type === "fraction")?.value ?? "00";

  return { symbol, whole, fraction };
}
