'use client';

import { useCartStore } from '@/store/cartStore';

const RECS = [
  {
    title: 'Love #10',
    price: '119.99',
    href: 'https://glowjerseys.com/products/love-10',
    img: 'https://glowjerseys.com/cdn/shop/files/Gemini_Generated_Image_hvqaphhvqaphhvqa.png?width=140',
  },
  {
    title: 'Surtain #2',
    price: '119.99',
    href: 'https://glowjerseys.com/products/surtain-2',
    img: 'https://glowjerseys.com/cdn/shop/files/Gemini_Generated_Image_b1shwvb1shwvb1sh.png?width=140',
  },
  {
    title: 'Reed #11',
    price: '119.99',
    href: 'https://glowjerseys.com/products/reed-11',
    img: 'https://glowjerseys.com/cdn/shop/files/Gemini_Generated_Image_t86c4zt86c4zt86c.png?width=140',
  },
  {
    title: 'Brown #11',
    price: '119.99',
    href: 'https://glowjerseys.com/products/brown-11',
    img: 'https://glowjerseys.com/cdn/shop/files/Screenshot2025-07-09at2.43.25PM.png?width=140',
  },
];

const COLOR_MAP: Record<string, string> = {
  '#FFE800': 'Yellow',
  '#FF8A00': 'Orange',
  '#2CC5F5': 'Ice Blue',
  '#17D63A': 'Green',
  '#FF1A15': 'Red',
  '#0A46FF': 'Blue',
  '#8A16FF': 'Purple',
  '#FF2E9A': 'Pink',
  '#FBECCB': 'Neutral White',
  '#FFFFFF': 'White',
  '#111111': 'Black',
  transparent: 'Transparent',
  Transparent: 'Transparent',
};

function getColorName(hexOrName: string | undefined): string {
  if (!hexOrName) return '—';
  const key = hexOrName.trim();
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  const found = Object.entries(COLOR_MAP).find(
    ([k]) => k.toLowerCase() === key.toLowerCase()
  );
  return found ? found[1] : key;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="group relative flex h-9 w-9 items-center justify-center text-black"
    >
      <span className="absolute inset-0 rounded-full bg-black/0 transition group-hover:bg-black/[0.08]" />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative z-[1]">
        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const carts = useCartStore((s) => s.carts);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal);

  if (!isOpen) return null;

  const total = subtotal();
  const isEmpty = carts.length === 0;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute right-0 top-5 inset-0 bg-black/50"
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[100%] md:max-w-[56rem] bg-white shadow-2xl">
        <div className="flex h-full w-full flex-col md:flex-row">
          <div className="hidden md:flex md:w-[45%] md:flex-col border-r border-[#e5e5e5] overflow-y-auto">
            <div className="px-8 pt-8 pb-4">
              <div className="text-[13px] font-medium uppercase tracking-[0.28em] text-black">
                You may also like
              </div>
            </div>
            <ul className="m-0 list-none space-y-0 px-8 pb-8">
              {RECS.map((r) => (
                <li key={r.title} className="flex gap-4 border-b border-[#eee] py-4 first:pt-0">
                  <a href={r.href} className="h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[2px] bg-neutral-100">
                    <img src={r.img} alt={r.title} className="h-full w-full object-cover" />
                  </a>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                      Glow Jerseys
                    </div>
                    <a href={r.href} className="block text-[15px] font-medium uppercase tracking-[0.04em] text-black hover:underline">
                      {r.title}
                    </a>
                    <div className="mt-0.5 text-[15px] text-black">
                      ${r.price.split('.')[0]}
                      <sup className="text-[10px]">.{r.price.split('.')[1]}</sup>
                    </div>
                    <a
                      href={r.href}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-black"
                    >
                      Choose options
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Cart panel */}
          <div className="flex h-full min-w-0 flex-1 flex-col">
            <div className="relative flex h-[64px] shrink-0 items-center justify-center border-b border-[#e5e5e5] px-4">
              <h2 className="m-0 text-[14px] font-medium uppercase tracking-[0.35em] text-black">
                Cart
              </h2>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CloseButton onClick={closeCart} />
              </div>
            </div>

            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <p className="m-0 text-[20px] text-black">Your cart is currently empty</p>
                <a
                  href="https://glowjerseys.com/collections/all"
                  className="inline-flex items-center justify-center border border-black px-8 py-3 text-[12px] uppercase tracking-[0.15em] text-black hover:bg-black hover:text-white transition"
                  onClick={closeCart}
                >
                  Return to shop
                </a>
              </div>
            ) : (
              <>
                {/* Mobile: recs above lines */}
                <div className="md:hidden border-b border-[#e5e5e5] px-5 pt-4 pb-2">
                  <div className="mb-3 text-[12px] font-medium uppercase tracking-[0.25em]">
                    You may also like
                  </div>
                  <ul className="m-0 list-none space-y-3 p-0">
                    {RECS.slice(0, 2).map((r) => (
                      <li key={r.title} className="flex gap-3">
                        <img src={r.img} alt="" className="h-14 w-14 object-cover rounded-sm" />
                        <div>
                          <div className="text-[13px] font-medium uppercase">{r.title}</div>
                          <div className="text-[13px]">${r.price}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-2 md:px-8">
                  <ul className="m-0 list-none p-0">
                    {carts.map((line) => {
                      const o = line.selectedOptions;
                      const title =
                        o.name && o.number
                          ? `${o.name.toUpperCase()} #${o.number}`
                          : line.productTitle;
                      return (
                        <li
                          key={line.id}
                          className="relative flex gap-4 border-b border-[#e5e5e5] py-5"
                        >
                          <button
                            type="button"
                            onClick={() => removeItem(line.id)}
                            className="absolute right-0 top-5 group relative flex h-8 w-8 items-center justify-center"
                            aria-label="Remove"
                          >
                            <span className="absolute inset-0 rounded-full bg-black/0 transition group-hover:bg-black/[0.08]" />
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="relative z-[1]">
                              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>

                          <div className="h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[2px] bg-neutral-100">
                            {o.previewImageUrl ? (
                              <img src={o.previewImageUrl} alt={title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                                —
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 pr-8">
  <div className="text-[15px] font-medium uppercase tracking-[0.04em] text-black">
    {title}
  </div>

  <div className="mt-1.5 space-y-0.5 text-[13px] text-neutral-500 leading-snug">
    <div>SIZE: {o.size} inch</div>
    <div>Backboard: {getColorName(o.backboardColor)}</div>
    <div>Sport: {o.sport}</div>
    <div>
      Custom Name &amp; Number: {o.name ? `${o.name} #${o.number}` : '—'}
    </div>
    <div>Jersey Color: {getColorName(o.jerseyColor)}</div>
    <div>Name Color: {getColorName(o.nameColor)}</div>
    <div>Number Color: {getColorName(o.numberColor)}</div>
  </div>

                            <div className="mt-3 flex items-end justify-between">
                              <div className="inline-flex items-center border border-[#ccc] rounded-sm">
                                <button
                                  type="button"
                                  className="flex h-8 w-8 items-center justify-center text-[16px] text-black"
                                  onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                >
                                  −
                                </button>
                                <span className="flex h-8 min-w-[1.75rem] items-center justify-center text-[13px]">
                                  {line.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="flex h-8 w-8 items-center justify-center text-[16px] text-black"
                                  onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-[16px] text-black">
                                ${(line.unitPrice * line.quantity).toFixed(2).replace(/\.(\d+)$/, (m, d) => (
                                  `.${d}`
                                ))}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-[#e5e5e5] px-5 py-5 md:px-8">
                  <div className="mb-3 flex border-y border-[#e5e5e5]">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.28em] text-black"
                    >
                      <span aria-hidden>✎</span> Note
                    </button>
                    <div className="w-px bg-[#e5e5e5]" />
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.28em] text-black"
                    >
                      <span aria-hidden>🚚</span> Shipping
                    </button>
                  </div>

                  <p className="m-0 mb-3 text-[12px] text-neutral-600">
                    Taxes and shipping calculated at checkout
                  </p>

                  <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[#e2e2e2] bg-[#f4f4f4] px-3 py-2.5 text-[13px] font-semibold text-[#3a3a3a]">
                    📦 Ships in 14–21 business days (7–10 with Express)
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0b45ff] px-4 py-3.5 text-[13px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#0939d6] transition"
                  >
                    Check out
                    <span className="opacity-80">—</span>
                    <span>${total.toFixed(2)} USD</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}