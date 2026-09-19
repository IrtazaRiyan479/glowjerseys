'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

const ORIGIN = 'https://glowjerseys.com';

const NAV = [
  { label: 'Featured', href: `${ORIGIN}/` },
  { label: 'Custom', href: `${ORIGIN}/apps/custom-jersey` },
  {
    label: 'Jerseys',
    href: `${ORIGIN}/collections/players`,
    children: [
      { label: 'Basketball', href: `${ORIGIN}/collections/basketball` },
      { label: 'Football', href: `${ORIGIN}/collections/football` },
      { label: 'Soccer', href: `${ORIGIN}/collections/soccer` },
      { label: 'Baseball', href: `${ORIGIN}/collections/baseball` },
      { label: 'Hockey', href: `${ORIGIN}/collections/hockey` },
    ],
  },
  { label: 'Athletes', href: `${ORIGIN}/pages/athletes` },
];

function IconHamburger() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-hamburger" fill="none" viewBox="0 0 32 32">
      <path d="M0 26.667h32M0 16h26.98M0 5.333h32" stroke="currentColor" />
    </svg>
  );
}

function IconClose({ className = 'icon icon-close' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className={className} fill="none" viewBox="0 0 12 12">
      <path d="M1 1L11 11" stroke="currentColor" strokeLinecap="round" fill="none" />
      <path d="M11 1L1 11" stroke="currentColor" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-search" fill="none" viewBox="0 0 15 17">
      <circle cx="7.11113" cy="7.11113" r="6.56113" stroke="currentColor" fill="none" />
      <path d="M11.078 12.3282L13.8878 16.0009" stroke="currentColor" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function IconAccount() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-account" fill="none" viewBox="0 0 14 18">
      <path d="M7.34497 10.0933C4.03126 10.0933 1.34497 12.611 1.34497 15.7169C1.34497 16.4934 1.97442 17.1228 2.75088 17.1228H11.9391C12.7155 17.1228 13.345 16.4934 13.345 15.7169C13.345 12.611 10.6587 10.0933 7.34497 10.0933Z" stroke="currentColor" />
      <ellipse cx="7.34503" cy="5.02631" rx="3.63629" ry="3.51313" stroke="currentColor" strokeLinecap="square" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-cart" fill="none" viewBox="0 0 18 19">
      <path d="M3.09333 5.87954L16.2853 5.87945V5.87945C16.3948 5.8795 16.4836 5.96831 16.4836 6.07785V11.4909C16.4836 11.974 16.1363 12.389 15.6603 12.4714C11.3279 13.2209 9.49656 13.2033 5.25251 13.9258C4.68216 14.0229 4.14294 13.6285 4.0774 13.0537C3.77443 10.3963 2.99795 3.58502 2.88887 2.62142C2.75288 1.42015 0.905376 1.51528 0.283581 1.51478" stroke="currentColor" />
      <path d="M13.3143 16.8554C13.3143 17.6005 13.9183 18.2045 14.6634 18.2045C15.4085 18.2045 16.0125 17.6005 16.0125 16.8554C16.0125 16.1104 15.4085 15.5063 14.6634 15.5063C13.9183 15.5063 13.3143 16.1104 13.3143 16.8554Z" fill="currentColor" />
      <path d="M3.72831 16.8554C3.72831 17.6005 4.33233 18.2045 5.07741 18.2045C5.8225 18.2045 6.42651 17.6005 6.42651 16.8554C6.42651 16.1104 5.8225 15.5063 5.07741 15.5063C4.33233 15.5063 3.72831 16.1104 3.72831 16.8554Z" fill="currentColor" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-arrow" fill="currentColor" viewBox="0 0 14 10">
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
        strokeLinecap="round"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-facebook" viewBox="0 0 320 512">
      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-instagram" viewBox="0 0 448 512">
      <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-tiktok" viewBox="0 0 448 512">
      <path fill="currentColor" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileJerseys, setMobileJerseys] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.totalQuantity());

  const jerseys = NAV.find((n) => n.children)!;
  const jerseysMobile = [
    { label: 'Baseball', href: `${ORIGIN}/collections/baseball` },
    { label: 'Basketball', href: `${ORIGIN}/collections/basketball` },
    { label: 'Football', href: `${ORIGIN}/collections/football` },
    { label: 'Hockey', href: `${ORIGIN}/collections/hockey` },
    { label: 'Soccer', href: `${ORIGIN}/collections/soccer` },
  ];

    useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="gj-theme shopify-section shopify-section-header">
      <div className="header-wrapper header-wrapper--border-bottom">
                <header className="header header--middle-left header--mobile-center page-width header-section--padding">
          <div className="header__left">
            <div className="header-drawer">
              <button
                type="button"
                className="header__icon header__icon--menu header__icon--hit focus-inset"
                aria-label="Menu"
                onClick={() => {
                  setMobileOpen(true);
                  setMobileJerseys(false);
                }}
              >
                <span className="header__icon header__icon--summary">
                  <IconHamburger />
                </span>
              </button>
            </div>
          </div>

          <a href={`${ORIGIN}/`} className="header__heading-link focus-inset">
            <img
              src={`${ORIGIN}/cdn/shop/files/GJ_icon_black.png?height=38&v=1786497402`}
              srcSet={`${ORIGIN}/cdn/shop/files/GJ_icon_black.png?height=38&v=1786497402 1x, ${ORIGIN}/cdn/shop/files/GJ_icon_black.png?height=76&v=1786497402 2x`}
              alt="Glow Jerseys GJ icon black"
              width={441}
              height={246}
              className="header__heading-logo medium-hide large-up-hide"
            />
            <img
              src={`${ORIGIN}/cdn/shop/files/GJ_Logos-01_1.png?height=46&v=1760123689`}
              srcSet={`${ORIGIN}/cdn/shop/files/GJ_Logos-01_1.png?height=46&v=1760123689 1x, ${ORIGIN}/cdn/shop/files/GJ_Logos-01_1.png?height=92&v=1760123689 2x`}
              alt="Glow Jerseys"
              width={467}
              height={113}
              className="header__heading-logo small-hide"
            />
          </a>

          <nav className="header__inline-menu">
            <ul className="list-menu list-menu--inline" role="list">
              {NAV.map((item) => {
                const isJerseys = Boolean(item.children);
                const isCustom = item.label === 'Custom';
                return (
                  <li
                    key={item.label}
                    onMouseEnter={isJerseys ? openMega : undefined}
                    onMouseLeave={isJerseys ? scheduleCloseMega : undefined}
                  >
                    <a
                      href={item.href}
                      className={`header__menu-item header__menu-item--top list-menu__item focus-inset${
                        isCustom && !megaOpen ? ' header__active-menu-item' : ''
                      }${isJerseys && megaOpen ? ' header__active-menu-item' : ''}${
                        megaOpen && !isJerseys ? ' players-mega-dim' : ''
                      }`}
                      aria-current={isCustom ? 'page' : undefined}
                    >
                      <span className="label">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header__right">
            <button
              type="button"
              className="header__icon header__icon--summary header__icon--search focus-inset"
              aria-label="Search our site"
              onClick={() => {
                setMegaOpen(false);
                setSearchOpen(true);
              }}
            >
              <span>
                <IconSearch />
              </span>
            </button>

            <a
              href={`${ORIGIN}/customer_authentication/redirect?locale=en&region_country=US`}
              className="header__icon header__icon--account focus-inset small-hide"
              aria-label="Log in"
            >
              <IconAccount />
              <span className="visually-hidden">Log in</span>
            </a>

                       <button
              type="button"
              className="header__icon header__icon--cart focus-inset"
              aria-label="Cart"
              onClick={openCart}
            >
              <span className="header__icon header__icon--summary header__icon--cart">
                <IconCart />
                <span className="visually-hidden">Cart</span>
                {count > 0 && <span className="cart-count-bubble">{count}</span>}
              </span>
            </button>
          </div>
        </header>

        {searchOpen && (
          <div className="search-modal is-open" role="dialog" aria-modal="true" aria-label="Search our site">
            <div className="page-width">
              <div className="search-modal__content">
                <form action={`${ORIGIN}/search`} method="get" role="search" className="search search-modal__form">
                  <div className="field">
                    <button type="submit" className="search__button" aria-label="Search our site">
                      <IconSearch />
                    </button>
                    <input
                      ref={searchInput}
                      className="search__input field__input"
                      type="search"
                      name="q"
                      placeholder="Search"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    <input type="hidden" name="type" value="product,article,page,collection" />
                    <button type="button" className="search__button" aria-label="Close" onClick={() => setSearchOpen(false)}>
                      <IconClose />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div
          className={`players-mega${megaOpen ? ' is-open' : ''}`}
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
        >
          <div className="page-width">
            <ul className="players-mega__list">
              {jerseys.children!.map((c) => (
                <li key={c.label}>
                  <a className="players-mega__link" href={c.href}>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`menu-drawer__overlay${mobileOpen ? ' is-open' : ''}`}
        aria-label="Close menu"
        onClick={() => setMobileOpen(false)}
      />
            <div className={`menu-drawer${mobileOpen ? ' is-open' : ''}${mobileJerseys ? ' is-submenu-open' : ''}`} tabIndex={-1}>
        <div className="menu-drawer__inner-container">
          <div className="menu-drawer__navigation-container">
            <button
              type="button"
              className="menu-drawer__close header__icon header__icon--menu"
              aria-label="Close"
              onClick={() => setMobileOpen(false)}
            >
              <IconClose />
            </button>

            <nav className="menu-drawer__navigation">
              <ul className="menu-drawer__menu list-menu" role="list">
                {NAV.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <button
                        type="button"
                        className="menu-drawer__menu-item list-menu__item"
                        onClick={() => setMobileJerseys(true)}
                      >
                        {item.label}
                        <IconArrow />
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className={`menu-drawer__menu-item list-menu__item${
                          item.label === 'Custom' ? ' menu-drawer__menu-item--active' : ''
                        }`}
                        aria-current={item.label === 'Custom' ? 'page' : undefined}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="menu-drawer__utility-links">
              <a
                href={`${ORIGIN}/customer_authentication/redirect?locale=en&region_country=US`}
                className="menu-drawer__account link link-with-icon"
              >
                <IconAccount />
                <span className="label">Log in</span>
              </a>
              <ul className="list list-social list-unstyled" role="list">
                <li className="list-social__item">
                  <a
                    target="_blank"
                    rel="noopener"
                    href="https://www.facebook.com/people/Glow-Jerseys/61559872375068/"
                    className="list-social__link link link--text link-with-icon"
                    aria-label="Facebook"
                  >
                    <IconFacebook />
                  </a>
                </li>
                <li className="list-social__item">
                  <a
                    target="_blank"
                    rel="noopener"
                    href="https://www.instagram.com/glowjerseys/"
                    className="list-social__link link link--text link-with-icon"
                    aria-label="Instagram"
                  >
                    <IconInstagram />
                  </a>
                </li>
                <li className="list-social__item">
                  <a
                    target="_blank"
                    rel="noopener"
                    href="https://www.tiktok.com/@glowjerseys?is_from_webapp=1&sender_device=pc"
                    className="list-social__link link link--text link-with-icon"
                    aria-label="TikTok"
                  >
                    <IconTiktok />
                  </a>
                </li>
              </ul>
            </div>

                       <div className={`menu-drawer__submenu${mobileJerseys ? ' is-open' : ''}`}>
              <div className="menu-drawer__inner-submenu">
                <div className="menu-drawer__topbar">
                  <button
                    type="button"
                    className="menu-drawer__close-button"
                    aria-label="Back"
                    onClick={() => setMobileJerseys(false)}
                  >
                    <IconArrow />
                  </button>
                  <a className="menu-drawer__menu-item" href={jerseys.href}>
                    Jerseys
                  </a>
                </div>
                <ul className="menu-drawer__menu list-menu" role="list">
                  {jerseysMobile.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        className="menu-drawer__menu-item list-menu__item"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}