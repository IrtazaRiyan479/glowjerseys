import { NextRequest, NextResponse } from 'next/server';
import { computeJerseyPrice } from '@/lib/pricing';
import { PRODUCT, toShopifyProperties, type JerseySelectedOptions } from '@/data';
import { draftOrderCreate, type DraftOrderLineItemInput } from '@/lib/shopify/adminClient';
import { verifyAppProxySignature } from '@/lib/shopify/verifyProxySignature';

type RequestLine = {
  selectedOptions: JerseySelectedOptions;
  quantity: number;
};

type StorefrontCartLine = { variant_id: number; quantity: number };

function isValidLine(line: unknown): line is RequestLine {
  if (!line || typeof line !== 'object') return false;
  const l = line as Record<string, unknown>;
  const opts = l.selectedOptions as Record<string, unknown> | undefined;
  return (
    typeof l.quantity === 'number' &&
    l.quantity > 0 &&
    !!opts &&
    typeof opts.size === 'number' &&
    typeof opts.sport === 'string' &&
    typeof opts.name === 'string' &&
    typeof opts.number === 'string' &&
    typeof opts.jerseyColor === 'string' &&
    typeof opts.nameColor === 'string' &&
    typeof opts.numberColor === 'string' &&
    typeof opts.backboardColor === 'string'
  );
}

function isValidStorefrontCartLine(line: unknown): line is StorefrontCartLine {
  if (!line || typeof line !== 'object') return false;
  const l = line as Record<string, unknown>;
  return typeof l.variant_id === 'number' && typeof l.quantity === 'number' && l.quantity > 0;
}

export async function POST(request: NextRequest) {
  // Only accept requests actually forwarded through Shopify's App Proxy —
  // this route is public otherwise, and creates real draft orders using our
  // server's Admin API credentials, so it can't trust an unsigned caller.
  let signatureValid: boolean;
  try {
    signatureValid = verifyAppProxySignature(request.nextUrl.searchParams);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signature verification is not configured.' },
      { status: 500 }
    );
  }
  if (!signatureValid) {
    return NextResponse.json(
      { error: 'Missing or invalid App Proxy signature.' },
      { status: 401 }
    );
  }

  let body: { lines?: unknown; storefrontCartLines?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  const lines = rawLines.filter(isValidLine);
  if (lines.length === 0) {
    return NextResponse.json({ error: 'No valid cart lines submitted.' }, { status: 400 });
  }

  // The shopper's real Shopify cart (fetched client-side, since /cart.js only
  // resolves to the shop's own domain when the page is loaded through the App
  // Proxy — this server has no access to that origin or the shopper's cart
  // cookie). Variant IDs/quantities are trusted as-is (that's just "what's in
  // the browser's cart", same as any storefront checkout); Shopify prices
  // these lines itself from the real variant, so nothing here is trusted for
  // pricing.
  const storefrontCartLines = (
    Array.isArray(body.storefrontCartLines) ? body.storefrontCartLines : []
  ).filter(isValidStorefrontCartLine);

  let customLineItems: DraftOrderLineItemInput[];
  try {
    // Authoritative price, recomputed server-side from the selected size —
    // the client-submitted config is never trusted for pricing.
    customLineItems = lines.map((line) => ({
      title: `${PRODUCT.name} — ${line.selectedOptions.size}" ${line.selectedOptions.sport}`,
      quantity: line.quantity,
      originalUnitPrice: computeJerseyPrice(line.selectedOptions.size).toFixed(2),
      requiresShipping: true,
      taxable: true,
      customAttributes: toShopifyProperties(line.selectedOptions),
    }));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to price cart lines.' },
      { status: 400 }
    );
  }

  const mergedLineItems: DraftOrderLineItemInput[] = [
    ...customLineItems,
    ...storefrontCartLines.map((item) => ({
      variantId: `gid://shopify/ProductVariant/${item.variant_id}`,
      quantity: item.quantity,
    })),
  ];

  try {
    const draftOrder = await draftOrderCreate({
      lineItems: mergedLineItems,
      note: typeof body.note === 'string' && body.note.length > 0 ? body.note : undefined,
    });
    return NextResponse.json({ invoiceUrl: draftOrder.invoiceUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create draft order.' },
      { status: 502 }
    );
  }
}
