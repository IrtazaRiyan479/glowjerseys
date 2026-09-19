import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export type ReviewerNameFormat =
  | ""
  | "last_initial"
  | "first_name_only"
  | "all_initials"
  | "anonymous";

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
    return NextResponse.json(
      { ok: false, error: "Reviews are not configured for this store yet." },
      { headers: CORS_HEADERS },
    );
  }
  const productExternalId = process.env.NEXT_PUBLIC_JUDGEME_PRODUCT_EXTERNAL_ID;

  const input: SubmitReviewBody = await request.json();

  try {
    const res = await fetch("https://api.judge.me/api/v1/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop_domain: shopDomain,
        platform: "shopify",
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
      return NextResponse.json(
        {
          ok: false,
          error:
            data?.error ||
            data?.message ||
            `Judge.me rejected the review (${res.status}).`,
        },
        { headers: CORS_HEADERS },
      );
    }
    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error — please try again." },
      { headers: CORS_HEADERS },
    );
  }
}
