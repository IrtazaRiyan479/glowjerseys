"use server";

export type ReviewerNameFormat =
  | ""
  | "last_initial"
  | "first_name_only"
  | "all_initials"
  | "anonymous";

export type SubmitReviewInput = {
  rating: number;
  title: string;
  body: string;
  name: string;
  email: string;
  reviewerNameFormat: ReviewerNameFormat;
  pictureUrls?: string[];
};

export type SubmitReviewResult = { ok: true } | { ok: false; error: string };

export async function submitReview(
  input: SubmitReviewInput,
): Promise<SubmitReviewResult> {
  const shopDomain = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;
  if (!shopDomain) {
    return {
      ok: false,
      error: "Reviews are not configured for this store yet.",
    };
  }
  const productExternalId = process.env.NEXT_PUBLIC_JUDGEME_PRODUCT_EXTERNAL_ID;

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
      return {
        ok: false,
        error:
          data?.error ||
          data?.message ||
          `Judge.me rejected the review (${res.status}).`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}
