'use client';

import { useState } from 'react';
import { Search, UserRound, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'FEATURED', href: '/featured' },
  { label: 'CUSTOM', href: '/custom' },
  { label: 'JERSEYS', href: '/jerseys', dropdown: true },
  { label: 'ATHLETES', href: '/athletes' },
];

const jerseyCategories = ['BASKETBALL', 'FOOTBALL', 'SOCCER', 'BASEBALL', 'HOCKEY'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jerseyOpen, setJerseyOpen] = useState(false);
  const [cartCount] = useState(2);

  return (
    <header className="relative z-50 w-full bg-white">
      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="hidden h-[96px] items-center border-b border-neutral-200 px-8 lg:flex">
        <div className="relative mx-auto flex h-full w-full max-w-[1920px] items-center">
          {/* LEFT NAVIGATION */}
          <nav className="flex h-full items-center gap-7">
            {navItems.map(item => (
              <div
                key={item.label}
                className="relative flex h-full items-center"
                onMouseEnter={() => {
                  if (item.dropdown) setJerseyOpen(true);
                }}
                onMouseLeave={() => {
                  if (item.dropdown) setJerseyOpen(false);
                }}
              >
                <Link
                  href={item.href}
                  className={`
                    relative flex h-full items-center
                    text-[17px] font-bold tracking-[0.03em]
                    transition-colors
                    ${item.label === 'CUSTOM' ? 'text-black' : 'text-neutral-900'}
                  `}
                >
                  {item.label}

                  {/* Active underline */}
                  {item.label === 'CUSTOM' && (
                    <span className="absolute bottom-[17px] left-0 right-0 h-[1px] bg-black" />
                  )}
                </Link>

                {/* Optional dropdown indicator */}
                {item.dropdown && <ChevronDown size={13} className="ml-1 hidden" />}

                {/* ================= JERSEY MEGA MENU ================= */}
                {item.dropdown && jerseyOpen && (
                  <div
                    className="absolute left-[-32px] top-full w-screen bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                    onMouseEnter={() => setJerseyOpen(true)}
                    onMouseLeave={() => setJerseyOpen(false)}
                  >
                    <div className="px-8 py-12">
                      <div className="mx-auto max-w-[1920px]">
                        <div className="flex flex-col gap-7">
                          {jerseyCategories.map(category => (
                            <Link
                              key={category}
                              href={`/jerseys/${category.toLowerCase()}`}
                              className="
                                w-fit
                                text-[24px]
                                font-bold
                                tracking-[0.02em]
                                text-neutral-900
                                transition-opacity
                                hover:opacity-60
                              "
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CENTER LOGO */}
          <Link
            href="/"
            className="
              absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              select-none
            "
          >
            {/* Replace this with your actual logo */}
            <div className="text-center leading-[0.72]">
              <div className="text-[38px] font-black tracking-[-0.08em]">GLOW✦</div>
              <div className="text-[38px] font-black tracking-[-0.08em]">JERSEYS</div>
            </div>
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="ml-auto flex items-center gap-7">
            <button aria-label="Search" className="transition-transform hover:scale-110">
              <Search size={28} strokeWidth={2} />
            </button>

            <button aria-label="Account" className="transition-transform hover:scale-110">
              <UserRound size={26} strokeWidth={2} />
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative transition-transform hover:scale-110"
            >
              <ShoppingCart size={27} strokeWidth={2} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute -right-[9px] -top-[10px]
                    flex h-[20px] min-w-[20px]
                    items-center justify-center
                    rounded-full bg-blue-600
                    px-1
                    text-[11px] font-bold text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="flex h-[72px] items-center border-b border-neutral-200 px-5 lg:hidden">
        {/* MENU BUTTON */}
        <button aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={27} strokeWidth={2} />
        </button>

        {/* MOBILE LOGO */}
        <Link
          href="/"
          className="
            absolute left-1/2
            -translate-x-1/2
            text-center
            leading-[0.72]
          "
        >
          <div className="text-[25px] font-black tracking-[-0.08em]">GLOW✦</div>
          <div className="text-[25px] font-black tracking-[-0.08em]">JERSEYS</div>
        </Link>

        {/* CART */}
        <Link href="/cart" className="relative ml-auto" aria-label="Cart">
          <ShoppingCart size={26} strokeWidth={2} />

          {cartCount > 0 && (
            <span
              className="
                absolute -right-[8px] -top-[9px]
                flex h-[19px] min-w-[19px]
                items-center justify-center
                rounded-full bg-blue-600
                px-1
                text-[10px] font-bold text-white
              "
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-[380px] bg-white">
            {/* Drawer Header */}
            <div className="flex h-[72px] items-center border-b border-neutral-200 px-5">
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={27} />
              </button>

              <div className="mx-auto text-center leading-[0.72]">
                <div className="text-[25px] font-black tracking-[-0.08em]">GLOW✦</div>
                <div className="text-[25px] font-black tracking-[-0.08em]">JERSEYS</div>
              </div>

              {/* Spacer */}
              <div className="w-[27px]" />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col">
              {navItems.map(item => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      flex items-center justify-between
                      border-b border-neutral-200
                      px-6 py-5
                      text-[17px]
                      font-bold
                      tracking-wide
                    "
                  >
                    {item.label}

                    {item.dropdown && <ChevronDown size={18} />}
                  </Link>

                  {/* Mobile Jersey Categories */}
                  {item.dropdown && (
                    <div className="bg-neutral-50 px-6">
                      {jerseyCategories.map(category => (
                        <Link
                          key={category}
                          href={`/jerseys/${category.toLowerCase()}`}
                          onClick={() => setMobileOpen(false)}
                          className="
                            block
                            border-b border-neutral-200
                            py-4
                            text-[15px]
                            font-semibold
                          "
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="flex gap-6 px-6 py-7">
              <button className="flex items-center gap-3 text-sm font-semibold">
                <Search size={21} />
                SEARCH
              </button>

              <button className="flex items-center gap-3 text-sm font-semibold">
                <UserRound size={21} />
                ACCOUNT
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
export default Navbar;
