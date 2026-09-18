export type JudgemeReview = {
  id: number;
  author: string;
  rating: number;
  title: string;
  text: string;
  verifiedBuyer: boolean;
  viaShopApp: boolean;
  badgeType: string | null;
  badgeLabel: string;
  createdAt: string;
  images: { small: string; original: string }[];
  hasVideo: boolean;
};

// Mirrors the "transparency badge" Judge.me renders under each review body.
function badgeFor(source: string): { type: string | null; label: string } {
  if (source === 'shop-app') return { type: 'review_written_in_shop_app', label: 'Review written in Shop App' };
  if (source === 'web') return { type: 'review_collected_from_store_visitor', label: 'Review collected from a store visitor' };
  return { type: null, label: '' };
}

export async function getReviews(): Promise<JudgemeReview[]> {
  const apiToken = process.env.JUDGEME_API_TOKEN;
  const shopDomain = process.env.JUDGEME_SHOP_DOMAIN;
  if (!apiToken || !shopDomain) return [];

  const url = `https://judge.me/api/v1/reviews?api_token=${encodeURIComponent(apiToken)}&shop_domain=${encodeURIComponent(shopDomain)}&per_page=100`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (data.reviews ?? [])
      .filter((r: any) => r.published !== false && r.hidden !== true)
      .map((r: any) => {
        const badge = badgeFor(r.source);
        return {
          id: r.id,
          author: r.reviewer?.name || 'Anonymous',
          rating: r.rating ?? 0,
          title: r.title || '',
          text: r.body || '',
          verifiedBuyer: r.verified === 'verified-purchase',
          viaShopApp: r.source === 'shop-app',
          badgeType: badge.type,
          badgeLabel: badge.label,
          createdAt: r.created_at || '',
          images: (r.pictures ?? [])
            .filter((p: any) => !p.hidden && p.urls?.small)
            .map((p: any) => ({ small: p.urls.small, original: p.urls.original || p.urls.small })),
          hasVideo: r.has_published_videos === true,
        };
      });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch {
    return [];
  }
}
