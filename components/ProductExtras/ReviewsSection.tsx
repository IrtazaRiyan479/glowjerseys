'use client';

import { useState } from 'react';
type Review = {
  author: string;
  verified: boolean;
  text: string;
  source: string;
};

const SAMPLE_REVIEWS: Review[] = [
  {
    author: 'Brandon',
    verified: true,
    text: 'Love the jersey lights. Getting a lot of complimets and they are perfect on my back patio. Will be getting some more for sure.',
    source: 'Review written in Shop App',
  },
];

export default function ReviewsSection() {
  const [page, setPage] = useState(1);
  const totalPages = 3;
  const review = SAMPLE_REVIEWS[0];

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
    </div>
  );
}
