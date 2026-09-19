'use client';

import { useEffect, useMemo, useState } from 'react';
import { publicAssetUrl } from '@/lib/publicAssetUrl';
import { uploadImage } from '@/actions/cloudinary/uploadImage';
import { submitReview, type ReviewerNameFormat } from '@/actions/judgeme/submitReview';
import type { JudgemeReview } from '@/lib/judgeme/getReviews';

/* Renders Judge.me's own widget markup (jdgm-* classes) against their real
   stylesheet in app/judgeme.css (widget_v3_base/main/media + the form
   partial, widget_v3_form.css, lazy-loaded on the live site only once the
   write-review form opens — vendored here too since we render it eagerly),
   so this matches the widget on the live storefront rather than
   approximating it. */

const REVIEWS_PER_PAGE = 5;
const PAGE_WINDOW_SIZE = 3;
const TITLE_MAX = 100;
const MAX_IMAGES = 5;
const CHECKMARK_SRC = 'https://public-images.judge.me/judgeme/logos/verified-checkmark.svg';
const SHOP_BADGE_SRC = 'https://public-images.judge.me/judgeme/verified-badge-v2/verified-by-shop_light.svg';
const MEDAL_BASE = 'https://public-images.judge.me/judgeme/medals-v2-2025-rebranding/auth';
const WIDGET_STYLE: React.CSSProperties = { width: '100%', maxWidth: 1200, margin: '0 auto' };

const BADGE_OFFSET: React.CSSProperties = { marginLeft: 10 };

const TRANSPARENCY_BADGE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  marginTop: '10px',
  marginRight: '2px',
  borderRadius: '0px',
  border: '1px solid rgb(230, 230, 230)',
  fontSize: '12px',
  color: 'rgb(123, 123, 123)',
};

type SortOption =
  | 'most-recent'
  | 'highest-rating'
  | 'lowest-rating'
  | 'only-pictures'
  | 'pictures-first'
  | 'videos-first'
  | 'most-helpful';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'most-recent', label: 'Most Recent' },
  { value: 'highest-rating', label: 'Highest Rating' },
  { value: 'lowest-rating', label: 'Lowest Rating' },
  { value: 'only-pictures', label: 'Only Pictures' },
  { value: 'pictures-first', label: 'Pictures First' },
  { value: 'videos-first', label: 'Videos First' },
  { value: 'most-helpful', label: 'Most Helpful' },
];

const byRecent = (a: JudgemeReview, b: JudgemeReview) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

function sortReviews(reviews: JudgemeReview[], sort: SortOption): JudgemeReview[] {
  const list = [...reviews];
  const hasPics = (r: JudgemeReview) => (r.images.length > 0 ? 1 : 0);
  const hasVid = (r: JudgemeReview) => (r.hasVideo ? 1 : 0);
  switch (sort) {
    case 'highest-rating':
      return list.sort((a, b) => b.rating - a.rating || byRecent(a, b));
    case 'lowest-rating':
      return list.sort((a, b) => a.rating - b.rating || byRecent(a, b));
    case 'only-pictures':
      return list.filter((r) => r.images.length > 0).sort(byRecent);
    case 'pictures-first':
      return list.sort((a, b) => hasPics(b) - hasPics(a) || byRecent(a, b));
    case 'videos-first':
      return list.sort((a, b) => hasVid(b) - hasVid(a) || byRecent(a, b));
    case 'most-helpful':
      // The reviews API exposes no helpfulness votes, so this can't be ranked
      // by votes. With zero votes the live widget falls back to recency too.
      return list.sort(byRecent);
    default:
      return list.sort(byRecent);
  }
}

// How a display name renders under each reviewer_name_format option —
// mirrors the live dropdown's own live preview ("displayed publicly like…").
function previewName(format: ReviewerNameFormat, rawName: string): string {
  const parts = (rawName || 'John Smith').trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || 'John';
  const last = parts.length > 1 ? parts[parts.length - 1] : 'Smith';
  switch (format) {
    case 'last_initial':
      return `${first} ${last.charAt(0).toUpperCase()}.`;
    case 'first_name_only':
      return first;
    case 'all_initials':
      return `${first.charAt(0).toUpperCase()}.${last.charAt(0).toUpperCase()}.`;
    case 'anonymous':
      return 'Anonymous';
    default:
      return `${first} ${last}`;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

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
              <span className="jdgm-rev__source" data-source="shop-app" style={BADGE_OFFSET}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="jdgm-rev__verification-badge-img" alt="Verified by Shop" src={SHOP_BADGE_SRC} />
              </span>
            ) : review.verifiedBuyer ? (
              // Text comes from CSS (.jdgm-rev__buyer-badge:before), so leave it empty.
              <span className="jdgm-rev__buyer-badge-wrapper" style={BADGE_OFFSET}>
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

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <span className="jdgm-form__rating" role="radiogroup" aria-label="Rating" aria-required="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <a
          key={n}
          data-alt={n}
          className={`jdgm-star ${shown >= n ? 'jdgm--on' : 'jdgm--off'}`}
          title={`${n} star${n > 1 ? 's' : ''}`}
          role="radio"
          aria-checked={value === n}
          tabIndex={n === 1 ? 0 : -1}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          href="#"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => {
            e.preventDefault();
            onChange(n);
          }}
        />
      ))}
    </span>
  );
}

function WriteReviewForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameFormat, setNameFormat] = useState<ReviewerNameFormat>('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES - images.length);
    e.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of files) {
        const dataUrl = await fileToDataUrl(file);
        const url = await uploadImage(dataUrl);
        setImages((prev) => [...prev, url]);
      }
    } catch {
      setError('Failed to upload picture — please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating.');
    if (!body.trim()) return setError('Please write your review.');
    if (!name.trim()) return setError('Please enter a display name.');
    if (!email.trim()) return setError('Please enter your email address.');

    setError(null);
    setSubmitting(true);
    const result = await submitReview({
      rating,
      title: title.trim(),
      body: body.trim(),
      name: name.trim(),
      email: email.trim(),
      reviewerNameFormat: nameFormat,
      pictureUrls: images,
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      onDone();
    } else {
      setError(result.error);
    }
  };

  if (submitted) {
    return (
      <div className="jdgm-form-wrapper">
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <p style={{ fontWeight: 700 }}>Thanks for your review!</p>
          <p style={{ fontSize: 14, color: '#7b7b7b', marginTop: 8 }}>
            It&apos;ll appear here once it&apos;s been approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="jdgm-form-wrapper">
      {/* Centers labels, the star picker, the upload box and the buttons.
          Typed field values stay left-aligned (text-left below) — centering
          a paragraph of someone's actual review text reads badly. */}
      <form className="jdgm-form" noValidate onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <div className="jdgm-form__title">Write a review</div>

        <div className="jdgm-form__fieldset" aria-label="Rating">
          <label>Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div className="jdgm-form__fieldset">
          <label className="jdgm-form__inline-label" htmlFor="gj-review-title">
            Review Title
          </label>
          <span className="jdgm-countdown">({TITLE_MAX - title.length})</span>
          <input
            id="gj-review-title"
            name="review_title"
            type="text"
            className="text-left"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            aria-label="Review Title"
          />
        </div>

        <div className="jdgm-form__fieldset">
          <label className="jdgm-form__inline-label" htmlFor="gj-review-body">
            Review content
          </label>
          <span className="jdgm-countdown" />
          <textarea
            id="gj-review-body"
            rows={5}
            name="review_body"
            required
            className="text-left"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Start writing here..."
            aria-label="Review content"
          />
        </div>

        <div className="jdgm-form__fieldset">
          <label>Picture/Video (optional)</label>
          <div
            className="jdgm-media-fieldset__container"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
          >
            {images.map((url, i) => (
              <div key={url} className="jdgm-picture-fieldset__box" style={{ width: 80, height: 80 }}>
                <div className="jdgm-picture-fieldset__box-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    className="jdgm-picture-fieldset__delete"
                    role="button"
                    tabIndex={0}
                    aria-label="Remove picture"
                    onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                  />
                </div>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <div
                className="jdgm-picture-fieldset__box jdgm-picture-fieldset__box--input"
                style={{ width: 80, height: 80, position: 'relative' }}
              >
                <div className="jdgm-picture-fieldset__box-wrapper">
                  <div className="jdgm-media-fieldset__icon">
                    {uploading && <div className="jdgm-spinner" style={{ width: 24, height: 24 }} />}
                  </div>
                </div>
                <input
                  type="file"
                  name="media"
                  className="jdgm-media-fieldset__input"
                  multiple
                  disabled={uploading}
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/webp"
                  aria-label="Choose a review picture (optional)"
                  onChange={handleFiles}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="jdgm-form__fieldset">
          <label className="jdgm-form__inline-label" htmlFor="gj-reviewer-name">
            Display name
          </label>
          <span className="jdgm-form__reviewer-name-format-container">
            (
            <label htmlFor="gj-reviewer-name-format" className="jdgm-form__inline-label jdgm-always-visible">
              displayed publicly like
            </label>
            <span className="jdgm-sort-dropdown-wrapper">
              <select
                id="gj-reviewer-name-format"
                value={nameFormat}
                onChange={(e) => setNameFormat(e.target.value as ReviewerNameFormat)}
                className="jdgm-sort-dropdown"
                aria-label="Name format"
              >
                <option value="">{previewName('', name)}</option>
                <option value="last_initial">{previewName('last_initial', name)}</option>
                <option value="first_name_only">{previewName('first_name_only', name)}</option>
                <option value="all_initials">{previewName('all_initials', name)}</option>
                <option value="anonymous">Anonymous</option>
              </select>
              <span className="jdgm-sort-dropdown-arrow" />
            </span>
            )
          </span>
          <input
            id="gj-reviewer-name"
            name="reviewer_name"
            type="text"
            required
            className="text-left"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            aria-label="Display name"
          />
        </div>

        <div className="jdgm-form__fieldset jdgm-form__email-fieldset">
          <label htmlFor="gj-reviewer-email">Email address</label>
          <input
            id="gj-reviewer-email"
            name="reviewer_email"
            type="email"
            required
            className="text-left"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
          />
        </div>

        {error && <div className="jdgm-input-error">{error}</div>}

        <div className="jdgm-form__fieldset">
          <p>
            How we use your data: We&apos;ll only contact you about the review you left, and only if necessary. By
            submitting your review, you agree to Judge.me&apos;s{' '}
            <a href="https://judge.me/terms" target="_blank" rel="nofollow noopener">
              terms
            </a>
            ,{' '}
            <a href="https://judge.me/privacy" target="_blank" rel="nofollow noopener">
              privacy
            </a>{' '}
            and{' '}
            <a href="https://judge.me/content-policy" target="_blank" rel="nofollow noopener">
              content
            </a>{' '}
            policies.
          </p>
        </div>

        <div className="jdgm-form__fieldset jdgm-form__fieldset-actions">
          <a href="#judgeme_product_reviews" role="button" className="jdgm-btn jdgm-btn--border jdgm-cancel-rev" onClick={(e) => { e.preventDefault(); onCancel(); }}>
            Cancel review
          </a>
          <input
            type="submit"
            className="jdgm-btn jdgm-btn--solid jdgm-submit-rev"
            value={submitting ? 'Submitting…' : 'Submit Review'}
            disabled={submitting || uploading}
          />
        </div>
      </form>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<JudgemeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('most-recent');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [writingReview, setWritingReview] = useState(false);

  useEffect(() => {
    fetch(publicAssetUrl('/api/reviews'))
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const authenticityPct = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.filter((r) => r.verifiedBuyer).length / reviews.length) * 100;
  }, [reviews]);

  // The histogram always reflects the full distribution — only the list
  // below narrows when a bar is selected, same as the live widget.
  const filteredReviews = useMemo(
    () => (ratingFilter ? reviews.filter((r) => r.rating === ratingFilter) : reviews),
    [reviews, ratingFilter]
  );
  const sortedReviews = useMemo(() => sortReviews(filteredReviews, sort), [filteredReviews, sort]);

  const toggleRatingFilter = (stars: number) => {
    setRatingFilter((prev) => (prev === stars ? null : stars));
    setPage(1);
  };

  if (loading) {
    return (
      <div className="jdgm-widget jdgm-review-widget" style={WIDGET_STYLE}>
        <div className="jdgm-rev-widg">
          <div style={{ padding: '48px 0' }}>
            <div className="jdgm-spinner" role="status" aria-label="Loading reviews" />
          </div>
        </div>
      </div>
    );
  }

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
      style={WIDGET_STYLE}
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
                  className={`jdgm-histogram__row${ratingFilter === stars ? ' jdgm-histogram__row--selected' : ''}`}
                  data-rating={stars}
                  data-frequency={count}
                  data-percentage={Math.round(pct)}
                  role="button"
                  tabIndex={count > 0 ? 0 : -1}
                  onClick={() => count > 0 && toggleRatingFilter(stars)}
                  onKeyDown={(e) => {
                    if (count > 0 && (e.key === 'Enter' || e.key === ' ')) toggleRatingFilter(stars);
                  }}
                >
                  <div
                    className="jdgm-histogram__star"
                    role="button"
                    aria-label={`${Math.round(pct)}% (${count}) reviews with ${stars} star rating`}
                    tabIndex={-1}
                  >
                    <Stars rating={stars} />
                  </div>
                  <div className="jdgm-histogram__bar">
                    <div className="jdgm-histogram__bar-content" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="jdgm-histogram__frequency">{count}</div>
                </div>
              ))}
              {ratingFilter !== null && (
                <div
                  className="jdgm-histogram__row jdgm-histogram__clear-filter"
                  style={{ display: 'block' }}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleRatingFilter(ratingFilter)}
                >
                  See all reviews
                </div>
              )}
            </div>

            <div className="jdgm-widget-actions-wrapper">
              <a
                href="#"
                role="button"
                className="jdgm-write-rev-link"
                onClick={(e) => {
                  e.preventDefault();
                  setWritingReview((v) => !v);
                }}
              >
                {writingReview ? 'Cancel review' : 'Write a review'}
              </a>
            </div>
          </div>
        </div>

        {/* CSS grid height trick: the track animates from 0fr to 1fr, and the
            inner overflow:hidden clips the form during that animation — a
            smooth open/close without ever measuring pixel heights in JS. */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: writingReview ? '1fr' : '0fr',
            transition: 'grid-template-rows 320ms ease',
          }}
        >
          <div style={{ overflow: 'hidden', minHeight: 0 }}>
            <WriteReviewForm onDone={() => {}} onCancel={() => setWritingReview(false)} />
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
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="jdgm-sort-dropdown-arrow" />
            </label>
          </div>
        </div>

        <div className="jdgm-rev-widg__body">
          <div className="jdgm-rev-widg__reviews">
            {pageReviews.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#7b7b7b' }}>
                No {ratingFilter}-star reviews yet.
              </div>
            ) : (
              pageReviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
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
