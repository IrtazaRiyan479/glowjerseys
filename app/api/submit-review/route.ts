import { NextResponse } from 'next/server';

/* A plain Route Handler, not a Server Action — deliberately. Server Actions
   invoked from a Client Component POST back to the current page URL with
   framework-internal headers (Content-Type: text/x-component, a Next-Action
   id). Through the Shopify App Proxy that POST lands on
   glowjerseys.com/apps/custom-jersey itself, and the proxy doesn't reliably
   forward what Next.js needs to recognize it as an action invocation — it
   just 500s. Same class of bug already fixed once in this codebase for the
   currency switcher (see components/Footer/LocalizationSwitcher.tsx) and for
   /_next/static assets (see next.config.ts / lib/publicAssetUrl.ts). A route
   handler, called via the absolute-URL pattern in publicAssetUrl(), sidesteps
   it entirely — same fix as /api/reviews. */

export type ReviewerNameFormat = '' | 'last_initial' | 'first_name_only' | 'all_initials' | 'anonymous';

type SubmitReviewBody = {
  rating: number;
  title: string;
  body: string;
  name: string;
  email: string;
  reviewerNameFormat: ReviewerNameFormat;
  pictureUrls?: string[];
};

export async function POST(request: Request) {
  const shopDomain = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;
  if (!shopDomain) {
    return NextResponse.json({ ok: false, error: 'Reviews are not configured for this store yet.' });
  }
  const productExternalId = process.env.NEXT_PUBLIC_JUDGEME_PRODUCT_EXTERNAL_ID;

  const input: SubmitReviewBody = await request.json();

  try {
    const res = await fetch('https://api.judge.me/api/v1/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_domain: shopDomain,
        platform: 'shopify',
        id: productExternalId ? Number(productExternalId) : undefined,
        name: input.name,
        email: input.email,
        rating: input.rating,
        title: input.title || undefined,
        body: input.body,
        reviewer_name_format: input.reviewerNameFormat || undefined,
        picture_urls: input.pictureUrls?.length ? input.pictureUrls : undefined,
      }),
    });

    if (!res.ok) {
      // Confirmed against the real API: error responses use either shape
      // depending on the endpoint/failure ({"message": "Shop not found"} for
      // an invalid shop_domain, {"error": "..."} elsewhere per their docs).
      const data = await res.json().catch(() => null);
      return NextResponse.json({
        ok: false,
        error: data?.error || data?.message || `Judge.me rejected the review (${res.status}).`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Network error — please try again.' });
  }
}
