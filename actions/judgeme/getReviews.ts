'use server';

export type JudgemeReview = {
  author: string;
  verified: boolean;
  text: string;
  source: string;
};

function sourceLabel(source: string): string {
  if (source === 'shop-app') return 'Review written in Shop App';
  if (source === 'web') return 'Review written on our site';
  return 'Judge.me Review';
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.reviews ?? [])
      .filter((r: any) => r.published !== false && r.hidden !== true)
      .map((r: any) => ({
        author: r.reviewer?.name || 'Anonymous',
        verified: r.verified === 'verified-purchase',
        text: r.body || r.title || '',
        source: sourceLabel(r.source),
      }));
  } catch {
    return [];
  }
}
