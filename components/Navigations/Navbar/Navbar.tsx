'use client';

import { useRef, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

const NAV = [
  { label: 'Featured', href: 'https://glowjerseys.com/' },
  { label: 'Custom', href: 'https://glowjerseys.com/products/custom-jersey' },
  {
    label: 'Jerseys',
    href: 'https://glowjerseys.com/collections/players',
    children: [
      { label: 'Baseball', href: 'https://glowjerseys.com/collections/baseball' },
      { label: 'Basketball', href: 'https://glowjerseys.com/collections/basketball' },
      { label: 'Football', href: 'https://glowjerseys.com/collections/football' },
      { label: 'Hockey', href: 'https://glowjerseys.com/collections/hockey' },
      { label: 'Soccer', href: 'https://glowjerseys.com/collections/soccer' },
    ],
  },
  { label: 'Athletes', href: 'https://glowjerseys.com/pages/athletes' },
];

const extractedCSS = 'width: 3.677rem; height: 1.688rem; background: linear-gradient(to top, rgb(2, 2, 2) 0px, rgb(2, 2, 2) 0px) no-repeat scroll 0% 100% / 100% 1px, rgba(0, 0, 0, 0) linear-gradient(to top, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 0px) no-repeat scroll 0% 100% / 100% 0.063rem; olor: rgba(14, 15, 17, 0.7);font-size: 0.94rem;font-family: Bayon, sans-serif;line-height: 1.688rem;transition: background-size 0.25s;background-image: linear-gradient(to top, rgb(2, 2, 2) 0px, rgb(2, 2, 2) 0px), linear-gradient(to top, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 0px);'

function IconClose() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CircleClose({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`group relative flex h-10 w-10 items-center justify-center text-black ${className}`}
    >
      <span className="absolute inset-0 rounded-full bg-black/[0.08] opacity-0 transition group-hover:opacity-100" />
      <span className="relative z-[1]">
        <IconClose />
      </span>
    </button>
  );
}

const linkBase =
  'relative px-2.5 py-2 text-[14px] font-semibold font-bayon uppercase tracking-[0.18em] transition-colors after:absolute after:left-2.5 after:right-2.5 after:bottom-1 after:h-[1px] after:bg-black after:opacity-0 after:transition-opacity hover:text-black hover:after:opacity-100';

const linkActive = 'text-black after:opacity-100';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
const [mobileJerseys, setMobileJerseys] = useState(false);
const [megaOpen, setMegaOpen] = useState(false);
const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const [searchOpen, setSearchOpen] = useState(false);

const openMega = () => {
  if (closeTimer.current) clearTimeout(closeTimer.current);
  setMegaOpen(true);
};

const closeMega = () => {
  if (closeTimer.current) clearTimeout(closeTimer.current);
  closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
};

const openSearch = () => {
  setMegaOpen(false);
  setSearchOpen(true);
};

const closeSearch = () => setSearchOpen(false);

  const carts = useCartStore((s) => s.carts);
  const openCart = useCartStore((s) => s.openCart);
  const count = carts.reduce((n, l) => n + l.quantity, 0);

  return (
    <header className="relative z-[60] w-full border-b border-[#e5e5e5] bg-white">
      <div className="relative mx-auto flex h-[70px] w-full max-w-[1400px] items-center px-5 md:h-[80px] md:px-10">
  {searchOpen ? (
    <form
      action="https://glowjerseys.com/search"
      method="get"
      className="flex h-11 w-full items-center rounded-full bg-[#f2f2f2] px-4 md:h-12"
    >
      <svg width="18" height="18" viewBox="0 0 15 17" fill="none" className="shrink-0 text-[#8a8a8a]" aria-hidden>
        <circle cx="7.1" cy="7.1" r="6.2" stroke="currentColor" strokeWidth="1.35" />
        <path d="M11.1 12.3L13.9 16" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
      <input
        name="q"
        type="search"
        autoFocus
        placeholder="Search"
        autoComplete="off"
        className="ml-3 h-full min-w-0 flex-1 bg-transparent text-[15px] text-black outline-none placeholder:text-[#8a8a8a]"
      />
      <button
        type="button"
        onClick={closeSearch}
        aria-label="Close search"
        className="flex h-8 w-8 shrink-0 items-center justify-center text-black"
      >
        <IconClose />
      </button>
    </form>
  ) : (
    <>
        {/* Mobile hamburger */}
        <button
          type="button"
          className="group relative flex h-11 w-11 items-center justify-center text-black lg:hidden"
          aria-label="Menu"
          onClick={() => {
            setMobileOpen(true);
            setMobileJerseys(false);
          }}
        >
          <span className="absolute inset-0 rounded-full bg-black/[0.08] opacity-0 transition group-hover:opacity-100" />
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className="relative z-[1]" aria-hidden>
            <path d="M0 26.667h32M0 16h27M0 5.333h32" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* Desktop nav */}
      <nav className="hidden items-center gap-1 lg:flex">
  {NAV.map((item) => {
    const isCustom = item.label === 'Custom';
const isJerseys = Boolean(item.children);
const dimOthers = megaOpen && !isJerseys;
const className = `${linkBase} ${extractedCSS} ${dimOthers ? 'text-black/40' : 'text-black/90'} ${
  isCustom && !megaOpen ? linkActive : ''
} ${isJerseys && megaOpen ? linkActive : ''}`;

    if (item.children) {
      return (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <a href={item.href} className={className}>
            {item.label}
          </a>
        </div>
      );
    }

    return (
      <a key={item.label} href={item.href} className={className}>
        {item.label}
      </a>
    );
  })}
</nav>


        {/* Logo */}
        <a
          href="https://glowjerseys.com/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
        >
          <img
            src="https://glowjerseys.com/cdn/shop/files/GJ_Logos-01_1.png?height=46&v=1760123689"
            alt="Glow Jerseys"
            className="hidden h-[32px] w-auto sm:block md:h-[40px]"
          />
          <img
            src="https://glowjerseys.com/cdn/shop/files/GJ_icon_black.png?height=38&v=1786497402"
            alt="Glow Jerseys"
            className="h-[26px] w-auto sm:hidden"
          />
        </a>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-0.5">
          <button
          type="button"
          onClick={openSearch}
          className="group relative flex h-11 w-11 items-center justify-center text-black"
          aria-label="Search"
        >
          <span className="absolute inset-0 rounded-full bg-black/[0.08] opacity-0 transition group-hover:opacity-100" />
          <svg width="17" height="19" viewBox="0 0 15 17" fill="none" className="relative z-[1]" aria-hidden>
            <circle cx="7.1" cy="7.1" r="6.2" stroke="currentColor" strokeWidth="1.35" />
            <path d="M11.1 12.3L13.9 16" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          </svg>
        </button>

          <a
            href="https://glowjerseys.com/customer_authentication/redirect?locale=en&region_country=US"
            className="group relative hidden h-11 w-11 items-center justify-center text-black sm:flex"
            aria-label="Log in"
          >
            <span className="absolute inset-0 rounded-full bg-black/[0.08] opacity-0 transition group-hover:opacity-100" />
            <svg width="15" height="19" viewBox="0 0 14 18" fill="none" className="relative z-[1]" aria-hidden>
              <path
                d="M7.34 10.1C4.03 10.1 1.34 12.6 1.34 15.7c0 .78.63 1.41 1.41 1.41h9.19c.78 0 1.41-.63 1.41-1.41 0-3.1-2.69-5.6-6-5.6z"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <ellipse cx="7.35" cy="5.03" rx="3.64" ry="3.51" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </a>

          <button
            type="button"
            onClick={openCart}
            className="group relative flex h-11 w-11 items-center justify-center text-black"
            aria-label="Cart"
          >
            <span className="absolute inset-0 rounded-full bg-black/[0.08] opacity-0 transition group-hover:opacity-100" />
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="relative z-[1]"
              aria-hidden
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" fill="currentColor" />
              <circle cx="18" cy="20" r="1" fill="currentColor" />
              <path d="M6 6L5 3H2" />
            </svg>
            {count > 0 && (
              <span className="absolute right-0.5 top-1 z-[2] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#0b45ff] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
        </>
  )}
      </div>
      

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl">
            {!mobileJerseys ? (
              <>
                <div className="flex h-14 items-center px-2">
                  <CircleClose onClick={() => setMobileOpen(false)} />
                </div>
                <nav className="flex-1 overflow-y-auto px-5">
                  <ul className="m-0 list-none space-y-0 p-0">
                    {NAV.map((item) => (
                      <li key={item.label}>
                        {item.children ? (
                          <button
                            type="button"
                            className="flex w-full items-center justify-between py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.2em] text-black"
                            onClick={() => setMobileJerseys(true)}
                          >
                            {item.label}
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                              <path
                                d="M8.5.8a.5.5 0 01.8-.2l4 4a.5.5 0 010 .7l-4 4a.5.5 0 11-.7-.7L11.8 5.5H1a.5.5 0 010-1h10.8L8.6 1.4a.5.5 0 01-.1-.6z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        ) : (
                          <a
                            href={item.href}
                            className="block py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-black"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-auto flex items-center justify-between border-t border-[#e5e5e5] px-5 py-4">
                  <a
                    href="https://glowjerseys.com/customer_authentication/redirect?locale=en&region_country=US"
                    className="flex items-center gap-2 text-[13px] text-black"
                  >
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden>
                      <path
                        d="M7.34 10.1C4.03 10.1 1.34 12.6 1.34 15.7c0 .78.63 1.41 1.41 1.41h9.19c.78 0 1.41-.63 1.41-1.41 0-3.1-2.69-5.6-6-5.6z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <ellipse cx="7.35" cy="5.03" rx="3.64" ry="3.51" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    Log in
                  </a>
                  <div className="flex items-center gap-4 text-black">
                    <a
                      href="https://www.facebook.com/people/Glow-Jerseys/61559872375068/"
                      aria-label="Facebook"
                      className="text-[14px] font-semibold"
                    >
                      f
                    </a>
                    <a href="https://www.instagram.com/glowjerseys/" aria-label="Instagram" className="text-[14px]">
                      IG
                    </a>
                    <a href="https://www.tiktok.com/@glowjerseys" aria-label="TikTok" className="text-[14px]">
                      TT
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-14 items-center gap-1 border-b border-[#e5e5e5] px-2">
                  <button
                    type="button"
                    className="group relative flex h-10 w-10 items-center justify-center"
                    onClick={() => setMobileJerseys(false)}
                    aria-label="Back"
                  >
                    <span className="absolute inset-0 rounded-full bg-black/[0.08] opacity-0 transition group-hover:opacity-100" />
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                      className="relative z-[1] rotate-180"
                      aria-hidden
                    >
                      <path
                        d="M8.5.8a.5.5 0 01.8-.2l4 4a.5.5 0 010 .7l-4 4a.5.5 0 11-.7-.7L11.8 5.5H1a.5.5 0 010-1h10.8L8.6 1.4a.5.5 0 01-.1-.6z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.2em]">Jerseys</span>
                  <div className="ml-auto">
                    <CircleClose onClick={() => setMobileOpen(false)} />
                  </div>
                </div>
                <ul className="m-0 list-none p-0">
                  {NAV.find((n) => n.children)!.children!.map((c) => (
                    <li key={c.label} className="border-b border-[#eee]">
                      <a
                        href={c.href}
                        className="block px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-black"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* Full-width submenu strip */}
      {megaOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 w-full border-b border-[#e5e5e5] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="mx-auto w-full max-w-[1400px] px-5 py-6 md:px-10">
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {NAV.find((n) => n.children)!.children!.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black hover:opacity-55"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}