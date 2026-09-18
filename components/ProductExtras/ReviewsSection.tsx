'use client';

import { useEffect, useState } from 'react';
import { getReviews, type JudgemeReview } from '@/actions/judgeme/getReviews';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<JudgemeReview[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  const totalPages = reviews.length;
  const review = reviews[page - 1];

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-9">
      <div className="border border-gray-200 rounded-lg p-5 max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">{review.author}</span>
          {review.verified && (
            <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              Verified by shop
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-3">{review.text}</p>
        <span className="text-[11px] text-gray-400 border border-gray-200 rounded px-2 py-0.5">
          {review.source}
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={n === page ? 'font-bold text-black' : 'text-gray-400 hover:text-black'}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="text-gray-400 hover:text-black"
            aria-label="Next page"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            className="text-gray-400 hover:text-black"
            aria-label="Last page"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
