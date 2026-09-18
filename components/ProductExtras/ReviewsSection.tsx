'use client';

import { useEffect, useMemo, useState } from 'react';
import { publicAssetUrl } from '@/lib/publicAssetUrl';
import type { JudgemeReview } from '@/lib/judgeme/getReviews';

/* Renders Judge.me's own widget markup (jdgm-* classes) against their real
   stylesheet in app/judgeme.css, so this matches the widget on the live
   storefront rather than approximating it. */

const REVIEWS_PER_PAGE = 5;
const PAGE_WINDOW_SIZE = 3;
const WRITE_REVIEW_URL = 'https://glowjerseys.com/products/custom-jersey#judgeme_product_reviews';
const CHECKMARK_SRC = 'https://public-images.judge.me/judgeme/logos/verified-checkmark.svg';
const SHOP_BADGE_SRC = 'https://public-images.judge.me/judgeme/verified-badge-v2/verified-by-shop_light.svg';
const MEDAL_BASE = 'https://public-images.judge.me/judgeme/medals-v2-2025-rebranding/auth';

// Judge.me's JS sets these inline rather than in the stylesheet.
const TRANSPARENCY_BADGE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  marginRight: '2px',
  borderRadius: '0px',
  border: '1px solid rgb(230, 230, 230)',
  fontSize: '12px',
  color: 'rgb(123, 123, 123)',
};

type SortOption = 'most-recent' | 'highest-rating' | 'lowest-rating';

function Stars({ rating }: { rating: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`jdgm-star ${i < rating ? 'jdgm--on' : 'jdgm--off'}`} />
      ))}
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
}

function getPageWindow(current: number, total: number, size = PAGE_WINDOW_SIZE): number[] {
  let start = Math.max(1, current - Math.floor((size - 1) / 2));
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function ReviewCard({ review }: { review: JudgemeReview }) {
  return (
    <div className="jdgm-rev jdgm-divider-top jdgm--done-setup" data-verified-buyer={review.verifiedBuyer}>
      <div className="jdgm-rev__header">
        <div className="jdgm-row-product" />
        <div className="jdgm-row-rating">
          <span
            className="jdgm-rev__rating"
            data-score={review.rating}
            role="img"
            aria-label={`${review.rating} star review`}
          >
            <Stars rating={review.rating} />
          </span>
          <time className="jdgm-rev__timestamp" dateTime={review.createdAt}>
            {formatDate(review.createdAt)}
          </time>
        </div>
        <div className="jdgm-row-profile">
          <div className="jdgm-rev__icon" />
          <span className="jdgm-rev__author-wrapper">
            <span className="jdgm-rev__author">{review.author}</span>
            {review.viaShopApp ? (
              <span className="jdgm-rev__source" data-source="shop-app">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="jdgm-rev__verification-badge-img" alt="Verified by Shop" src={SHOP_BADGE_SRC} />
              </span>
            ) : review.verifiedBuyer ? (
              // Text comes from CSS (.jdgm-rev__buyer-badge:before), so leave it empty.
              <span className="jdgm-rev__buyer-badge-wrapper">
                <span className="jdgm-rev__buyer-badge" />
              </span>
            ) : null}
          </span>
        </div>
        <div className="jdgm-row-extra">
          <span className="jdgm-rev__location" />
        </div>
        <div className="jdgm-rev__br" />
      </div>

      <div className="jdgm-rev__content">
        {review.title && <b className="jdgm-rev__title">{review.title}</b>}
        <div className="jdgm-rev__body">
          <p>{review.text}</p>
        </div>
        {review.images.length > 0 && (
          <div className="jdgm-rev__pics">
            {review.images.map((img, i) => (
              <a
                key={i}
                className="jdgm-rev__pic-link"
                target="_blank"
                rel="nofollow noopener"
                href={img.original}
                aria-label={`${review.author} review photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="jdgm-rev__pic-img" alt={`${review.author} review photo`} src={img.small} />
              </a>
            ))}
          </div>
        )}
        {review.badgeType && (
          <div className="jdgm-rev__transparency-badge-wrapper">
            <div
              className="jdgm-rev__transparency-badge"
              data-badge-type={review.badgeType}
              style={TRANSPARENCY_BADGE_STYLE}
            >
              {review.badgeLabel}
            </div>
          </div>
        )}
      </div>

      <div className="jdgm-rev__actions">
        <div className="jdgm-rev__social" />
        <div className="jdgm-rev__votes" />
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<JudgemeReview[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('most-recent');

  useEffect(() => {
    fetch(publicAssetUrl('/api/reviews'))
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => setReviews([]));
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const authenticityPct = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.filter((r) => r.verifiedBuyer).length / reviews.length) * 100;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sort === 'highest-rating') copy.sort((a, b) => b.rating - a.rating);
    else if (sort === 'lowest-rating') copy.sort((a, b) => a.rating - b.rating);
    else copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return copy;
  }, [reviews, sort]);

  if (reviews.length === 0) return null;

  // Approximate tier cutoffs — Judge.me doesn't publish the exact thresholds.
  const tier =
    authenticityPct >= 95 ? 'diamond' : authenticityPct >= 85 ? 'gold' : authenticityPct >= 70 ? 'silver' : 'bronze';
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const pageReviews = sortedReviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);
  const pageWindow = getPageWindow(page, totalPages);
  const average = averageRating.toFixed(2);

  const histogram = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count, pct: (count / reviews.length) * 100 };
  });

  return (
    <div
      className="jdgm-widget jdgm-review-widget jdgm--done-setup-widget"
      data-widget="review"
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="jdgm-rev-widg" data-average-rating={average} data-number-of-reviews={reviews.length}>
        <div className="jdgm-rev-widg__header">
          <h2 className="jdgm-rev-widg__title">Customer Reviews</h2>

          <div className="jdgm-row-stars">
            <div className="jdgm-rev-widg__summary">
              <div className="jdgm-rev-widg__summary-inner">
                <div
                  className="jdgm-rev-widg__summary-stars"
                  aria-label={`Average rating is ${average} stars`}
                  role="img"
                >
                  <Stars rating={Math.round(averageRating)} />
                  <span className="jdgm-rev-widg__summary-average">{average} out of 5</span>
                </div>
                <div className="jdgm-rev-widg__summary-text jdgm-all-reviews__summary-text--verified">
                  Based on {reviews.length} reviews
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="jdgm-verified-checkmark" src={CHECKMARK_SRC} alt="Verified Checkmark" />
                </div>
              </div>
            </div>

            <div className="jdgm-histogram">
              {histogram.map(({ stars, count, pct }) => (
                <div
                  key={stars}
                  className="jdgm-histogram__row"
                  data-rating={stars}
                  data-frequency={count}
                  data-percentage={Math.round(pct)}
                >
                  <div
                    className="jdgm-histogram__star"
                    role="button"
                    aria-label={`${Math.round(pct)}% (${count}) reviews with ${stars} star rating`}
                    tabIndex={0}
                  >
                    <Stars rating={stars} />
                  </div>
                  <div className="jdgm-histogram__bar">
                    <div className="jdgm-histogram__bar-content" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="jdgm-histogram__frequency">{count}</div>
                </div>
              ))}
            </div>

            <div className="jdgm-widget-actions-wrapper">
              <a
                href={WRITE_REVIEW_URL}
                target="_blank"
                rel="noopener"
                className="jdgm-write-rev-link"
                role="button"
              >
                Write a review
              </a>
            </div>
          </div>
        </div>

        <div className="jdgm-row-media">
          <div className="jdgm-medals-wrapper">
            <div className="jdgm-medals">
              <div className="jdgm-medals__container">
                <div
                  className="jdgm-medal-wrapper"
                  title={`${authenticityPct.toFixed(1)}% of published reviews are verified reviews`}
                >
                  <a className="jdgm-medal" data-value={authenticityPct.toFixed(1)} data-type="auth" data-tier={tier}>
                    <div className="jdgm-medal__image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={`Judge.me ${tier} Authentic Shop medal`} src={`${MEDAL_BASE}/${tier}.svg`} />
                    </div>
                    <div className="jdgm-medal__value">{authenticityPct.toFixed(1)}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="jdgm-row-actions">
          <div className="jdgm-rev-widg__sort-wrapper">
            <label className="jdgm-sort-dropdown-wrapper">
              <select
                className="jdgm-sort-dropdown"
                aria-label="Sort by"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
              >
                <option value="most-recent">Most Recent</option>
                <option value="highest-rating">Highest Rating</option>
                <option value="lowest-rating">Lowest Rating</option>
              </select>
              <span className="jdgm-sort-dropdown-arrow" />
            </label>
          </div>
        </div>

        <div className="jdgm-rev-widg__body">
          <div className="jdgm-rev-widg__reviews">
            {pageReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="jdgm-paginate" data-per-page={REVIEWS_PER_PAGE}>
              {pageWindow.map((n) => (
                <a
                  key={n}
                  className={`jdgm-paginate__page${n === page ? ' jdgm-curt' : ''}`}
                  data-page={n}
                  aria-label={`Page ${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  tabIndex={0}
                  role="button"
                  onClick={() => setPage(n)}
                >
                  {n}
                </a>
              ))}
              {page < totalPages && (
                <>
                  <a
                    className="jdgm-paginate__page jdgm-paginate__next-page"
                    data-page={page + 1}
                    aria-label={`Page ${page + 1}`}
                    tabIndex={0}
                    rel="next"
                    role="button"
                    onClick={() => setPage(page + 1)}
                  />
                  <a
                    className="jdgm-paginate__page jdgm-paginate__last-page"
                    data-page={totalPages}
                    aria-label={`Page ${totalPages}`}
                    tabIndex={0}
                    role="button"
                    onClick={() => setPage(totalPages)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
