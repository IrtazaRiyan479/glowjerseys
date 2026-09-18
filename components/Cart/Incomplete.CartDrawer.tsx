'use client';

import { useCartStore, type CartLine } from '@/store/cartStore';
import { updateStorefrontCartNote } from '@/lib/shopify/storefrontCart';
import { SIZE_OPTIONS, numericVariantId } from '@/data';
import { useEffect, useState, type CSSProperties } from 'react';

const JERSEY_VARIANT_IDS = new Set(SIZE_OPTIONS.map((o) => numericVariantId(o.variantId)));
const ORIGIN = 'https://glowjerseys.com';

const RECS = [
  {
    title: 'Jordan #23',
    price: '119.99',
    href: `${ORIGIN}/products/jordan-23`,
    img: 'https://glowjerseys.com/cdn/shop/files/Gemini_Generated_Image_n0c5nvn0c5nvn0c5.png?v=1781552626&width=140',
    ratio: '100%',
    alt: 'Jordan ',
  },
  {
    title: 'Hall #20',
    price: '119.99',
    href: `${ORIGIN}/products/hall-20`,
    img: 'https://glowjerseys.com/cdn/shop/files/Screenshot2025-07-09at2.52.55PM.png?v=1752090782&width=140',
    ratio: '138.90020366598776%',
    alt: 'Hall ',
  },
  {
    title: 'Point #21',
    price: '119.99',
    compareAt: '99.99',
    href: `${ORIGIN}/products/point-21`,
    img: 'https://glowjerseys.com/cdn/shop/files/Screenshot2026-01-07at3.24.23PM.png?v=1767821070&width=140',
    ratio: '133.69175627240145%',
    alt: 'Point ',
  },
  {
    title: 'Custom Soccer Glow Jersey',
    price: '164.99',
    href: `${ORIGIN}/products/custom-soccer-glow-jersey`,
    img: 'https://glowjerseys.com/cdn/shop/files/Gemini_Generated_Image_f4fxr1f4fxr1f4fx.png?v=1781551905&width=140',
    ratio: '100%',
    alt: 'Custom Soccer Glow Jersey',
  },
];

const COLOR_MAP: Record<string, string> = {
  '#FFE800': 'Yellow',
  '#FF8A00': 'Orange',
  '#FF3300': 'Orange',
  '#2CC5F5': 'Ice Blue',
  '#17D63A': 'Green',
  '#FF1A15': 'Red',
  '#0A46FF': 'Blue',
  '#0B45FF': 'Blue',
  '#8A16FF': 'Purple',
  '#FF2E9A': 'Pink',
  '#FBECCB': 'Neutral White',
  '#E8C07A': 'Neutral White',
  '#FFFFFF': 'White',
  '#111111': 'Black',
  transparent: 'Transparent',
  Transparent: 'Transparent',
};

function getColorName(hexOrName: string | undefined): string {
  if (!hexOrName) return '—';
  const key = hexOrName.trim();
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  const found = Object.entries(COLOR_MAP).find(([k]) => k.toLowerCase() === key.toLowerCase());
  return found ? found[1] : key;
}

function PriceMoney({ amount }: { amount: number | string }) {
  const n = typeof amount === 'number' ? amount : parseFloat(String(amount));
  const [dollars, cents] = n.toFixed(2).split('.');
  return (
    <bdi>
      <span className="price__prefix">$</span>
      {dollars}
      <sup className="price__suffix">.{cents}</sup>
    </bdi>
  );
}

function IconSpinner() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-spinner" fill="none" viewBox="0 0 66 66">
      <circle className="path" fill="none" strokeWidth="6" cx="33" cy="33" r="30" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-close" fill="none" viewBox="0 0 12 12">
      <path d="M1 1L11 11" stroke="currentColor" strokeLinecap="round" fill="none" />
      <path d="M11 1L1 11" stroke="currentColor" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function IconPen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-pen" fill="none" viewBox="0 0 512 512">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M493.25 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.26 18.74L12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.78-.05 2.69-.15l114.14-12.61 352.48-352.48c24.99-24.99 24.99-65.51-.01-90.5zM126.09 468.68l-93.03 10.31 10.36-93.17 263.89-263.89 82.77 82.77-263.99 263.98zm344.54-344.54l-57.93 57.93-82.77-82.77 57.93-57.93c6.04-6.04 14.08-9.37 22.63-9.37 8.55 0 16.58 3.33 22.63 9.37l37.51 37.51c12.47 12.48 12.47 32.78 0 45.26z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-truck" fill="none" viewBox="0 0 640 512">
      <path
        fill="currentColor"
        d="M280 192c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240zm352 192h-24V275.9c0-16.8-6.8-33.3-18.8-45.2l-83.9-83.9c-11.8-12-28.3-18.8-45.2-18.8H416V78.6c0-25.7-22.2-46.6-49.4-46.6H113.4C86.2 32 64 52.9 64 78.6V96H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H96V78.6c0-8.1 7.8-14.6 17.4-14.6h253.2c9.6 0 17.4 6.5 17.4 14.6V384H207.6C193 364.7 170 352 144 352c-18.1 0-34.6 6.2-48 16.4V288H64v144c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16h195.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-488 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm272-320h44.1c8.4 0 16.7 3.4 22.6 9.4l83.9 83.9c.8.8 1.1 1.9 1.8 2.8H416V160zm80 320c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-96h-16.4C545 364.7 522 352 496 352s-49 12.7-63.6 32H416v-96h160v96zM256 248v-16c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8z"
      />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-arrow" fill="none" viewBox="0 0 14 10">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z" fill="currentColor" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-cart medium-hide large-up-hide" fill="none" viewBox="0 0 18 19">
      <path d="M3.09333 5.87954L16.2853 5.87945V5.87945C16.3948 5.8795 16.4836 5.96831 16.4836 6.07785V11.4909C16.4836 11.974 16.1363 12.389 15.6603 12.4714C11.3279 13.2209 9.49656 13.2033 5.25251 13.9258C4.68216 14.0229 4.14294 13.6285 4.0774 13.0537C3.77443 10.3963 2.99795 3.58502 2.88887 2.62142C2.75288 1.42015 0.905376 1.51528 0.283581 1.51478" stroke="currentColor" />
      <path d="M13.3143 16.8554C13.3143 17.6005 13.9183 18.2045 14.6634 18.2045C15.4085 18.2045 16.0125 17.6005 16.0125 16.8554C16.0125 16.1104 15.4085 15.5063 14.6634 15.5063C13.9183 15.5063 13.3143 16.1104 13.3143 16.8554Z" fill="currentColor" />
      <path d="M3.72831 16.8554C3.72831 17.6005 4.33233 18.2045 5.07741 18.2045C5.8225 18.2045 6.42651 17.6005 6.42651 16.8554C6.42651 16.1104 5.8225 15.5063 5.07741 15.5063C4.33233 15.5063 3.72831 16.1104 3.72831 16.8554Z" fill="currentColor" />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-minus" fill="none" viewBox="0 0 10 2">
      <path fillRule="evenodd" clipRule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-plus" fill="none" viewBox="0 0 10 10">
      <path fillRule="evenodd" clipRule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor" />
    </svg>
  );
}

function IconDiscount() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-discount" fill="none" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm2.828 8.486a2 2 0 1 0 2.828-2.829 2 2 0 0 0-2.828 2.829z" fill="currentColor" />
    </svg>
  );
}

function closeDetails(el: HTMLElement) {
  el.closest('details')?.removeAttribute('open');
}

function Recs() {
  return (
    <div className="cart-recommendations">
      <div className="title h4">You may also like</div>
      <ul className="mini-cart__navigation">
        {RECS.map((r) => (
          <li key={r.title}>
            <div className="product-container product-container--link">
              <div className="product-image">
                <a href={r.href} className="media-wrapper media-wrapper--small">
                  <div className="media media--adapt" style={{ '--image-ratio-percent': r.ratio } as CSSProperties}>
                    <img src={r.img} alt={r.alt} width={70} height={70} />
                  </div>
                </a>
              </div>
              <div className="product-description">
                <span className="visually-hidden">Vendor:</span>
                <div className="caption-with-letter-spacing">Glow Jerseys</div>
                <div className="product-content">
                  <a href={r.href} className="link product-title">
                    {r.title}
                  </a>
                </div>
                <div className={`price${r.compareAt ? ' price--on-sale' : ''}`}>
                  <dl>
                    <div className="price__regular">
                      <dt>
                        <span className="visually-hidden visually-hidden--inline">Regular price</span>
                      </dt>
                      <dd>
                        <span className="price-item price-item--regular">
                          <PriceMoney amount={r.price} />
                        </span>
                      </dd>
                    </div>
                    <div className="price__sale">
                      <dt className="price__compare">
                        <span className="visually-hidden visually-hidden--inline">Regular price</span>
                      </dt>
                      <dd className="price__compare">
                        <s className="price-item price-item--regular">
                          {r.compareAt ? <PriceMoney amount={r.compareAt} /> : <bdi />}
                        </s>
                      </dd>
                      <dt>
                        <span className="visually-hidden visually-hidden--inline">Sale price</span>
                      </dt>
                      <dd>
                        <span className="price-item price-item--sale">
                          <PriceMoney amount={r.price} />
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="product-button">
                  <a href={r.href} className="button button--small button--cta" tabIndex={-1}>
                    <span className="small-hide">
                      <span className="label">Choose options</span>
                      <IconArrow />
                    </span>
                    <IconCart />
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LineOptions({ item }: { item: CartLine }) {
  const isJersey = JERSEY_VARIANT_IDS.has(item.variant_id);
  const p = item.properties ?? {};
  if (isJersey) {
    const nameNum = p['Custom Name & Number'] || (p.Name ? `${p.Name} #${p.Number}` : '—');
    return (
      <dl>
        <div className="product-option">
          <dt>SIZE: </dt>
          <dd>{p.Size || p.SIZE || item.variant_title}</dd>
        </div>
        <div className="product-option">
          <dt>Backboard: </dt>
          <dd>{getColorName(p.Backboard)}</dd>
        </div>
        <div className="product-option">
          <dt>Sport: </dt>
          <dd>{p.Sport}</dd>
        </div>
        <div className="product-option">
          <dt>Custom Name & Number: </dt>
          <dd>{nameNum}</dd>
        </div>
        <div className="product-option">
          <dt>Jersey Color: </dt>
          <dd>{getColorName(p['Jersey Color'])}</dd>
        </div>
        <div className="product-option">
          <dt>Name Color: </dt>
          <dd>{getColorName(p['Name Color'])}</dd>
        </div>
        <div className="product-option">
          <dt>Number Color: </dt>
          <dd>{getColorName(p['Number Color'])}</dd>
        </div>
      </dl>
    );
  }
  if (item.variant_title && item.variant_title !== 'Default Title') {
    return (
      <dl>
        <div className="product-option">
          <dt>Size:</dt>
          <dd>{item.variant_title}</dd>
        </div>
      </dl>
    );
  }
  return null;
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const subtotal = useCartStore((s) => s.subtotal);
  const items = useCartStore((s) => s.storefrontItems);
  const updateStorefrontItem = useCartStore((s) => s.updateStorefrontItem);

  const [shown, setShown] = useState(isOpen);
  const [entered, setEntered] = useState(false);
  const [note, setNote] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [storefrontUpdatingKey, setStorefrontUpdatingKey] = useState<string | null>(null);
  const [storefrontError, setStorefrontError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShown(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      document.body.style.overflow = 'hidden';
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    document.body.style.overflow = '';
    const t = window.setTimeout(() => setShown(false), 500);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  if (!shown) return null;

  const total = subtotal();
  const isEmpty = items.length === 0;
  const [dollars, cents] = total.toFixed(2).split('.');

  const handleStorefrontQuantityChange = async (key: string, quantity: number) => {
    if (storefrontUpdatingKey) return;
    setStorefrontUpdatingKey(key);
    setStorefrontError(null);
    try {
      await updateStorefrontItem(key, quantity);
    } catch (err) {
      setStorefrontError(err instanceof Error ? err.message : 'Failed to update cart.');
    } finally {
      setStorefrontUpdatingKey(null);
    }
  };

  const handleCheckout = async () => {
    if (checkingOut || isEmpty) return;
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      if (note) await updateStorefrontCartNote(note).catch(() => undefined);
      window.location.href = `${ORIGIN}/checkout`;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed.');
      setCheckingOut(false);
    }
  };

  return (
    <div className={`gj-theme${entered ? ' mini-cart--open' : ''}`}>
      <button
        type="button"
        className={`cart-drawer-overlay${entered ? ' is-open' : ''}`}
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside className={`cart-drawer${entered ? ' is-open' : ''}${isEmpty ? ' is-empty' : ''}`} id="mini-cart">
        <form className={`mini-cart${isEmpty ? ' is-empty' : ''}`} onSubmit={(e) => e.preventDefault()}>
          <div className="mini-cart__inner">
            <div className="mini-cart__header">
              <button
                type="button"
                className="header__icon header__icon--summary header__icon--cart cart-close"
                aria-label="Close"
                onClick={closeCart}
              >
                <IconClose />
              </button>
              <div className="title h4">Cart</div>
              <span className="mini-cart__border" />
            </div>

            <div className="mini-cart__empty center">
              <p className="mini-cart__empty-text h3">Your cart is currently empty</p>
              <a href={`${ORIGIN}/collections/all`} className="button button--tertiary" onClick={closeCart}>
                Return to shop
              </a>
            </div>

            <div className="mini-cart__main" id="main-cart-items">
              <Recs />
              {storefrontError && (
                <p role="alert" className="cart-item__error form__message errors">
                  {storefrontError}
                </p>
              )}
              <ul className="mini-cart__navigation">
                {items.map((item) => {
                  const isJersey = JERSEY_VARIANT_IDS.has(item.variant_id);
                  const p = item.properties ?? {};
                  const image = isJersey ? p['Preview Image'] || item.image : item.image;
                  const updating = storefrontUpdatingKey === item.key;
                  const discounted = Boolean(item.original_line_price && item.original_line_price > item.line_price);
                  return (
                    <li key={item.key}>
                      <div className={`loading-overlay${updating ? '' : ' hidden'}`}>
                        <div className="loading-overlay__spinner">
                          <IconSpinner />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="delete-product"
                        aria-label={`Remove ${item.product_title}`}
                        disabled={updating}
                        onClick={() => handleStorefrontQuantityChange(item.key, 0)}
                      >
                        <IconClose />
                      </button>
                      <div className="product-container">
                        <div className="product-image">
                          {image ? (
                            <a href={item.url} className="media-wrapper media-wrapper--small">
                              <div className="media media--adapt" style={{ '--image-ratio-percent': '100%' } as CSSProperties}>
                                <img src={image} alt={item.product_title} width={70} height={70} />
                              </div>
                            </a>
                          ) : null}
                        </div>
                        <div className="product-description">
                          <div className="product-content">
                            <a href={item.url} className="link product-title">
                              {item.product_title}
                            </a>
                          </div>
                          <LineOptions item={item} />
                          {item.discount_title ? (
                            <ul className="discounts list-unstyled" role="list" aria-label="Discount">
                              <li className="discounts__discount">
                                <IconDiscount />
                                {item.discount_title}
                              </li>
                            </ul>
                          ) : null}
                          <div className="product-quantity">
                            <div className="quantity">
                              <button
                                type="button"
                                className="quantity__button"
                                aria-label={`Decrease quantity for ${item.product_title}`}
                                disabled={updating}
                                onClick={() => handleStorefrontQuantityChange(item.key, item.quantity - 1)}
                              >
                                <IconMinus />
                              </button>
                              <input
                                className="quantity__input"
                                type="number"
                                readOnly
                                value={item.quantity}
                                aria-label={`Quantity for ${item.product_title}`}
                              />
                              <button
                                type="button"
                                className="quantity__button"
                                aria-label={`Increase quantity for ${item.product_title}`}
                                disabled={updating}
                                onClick={() => handleStorefrontQuantityChange(item.key, item.quantity + 1)}
                              >
                                <IconPlus />
                              </button>
                            </div>
                            {discounted ? (
                              <dl className="cart-item__discounted-prices">
                                <dt className="visually-hidden">Regular price</dt>
                                <dd className="price--on-sale">
                                  <s className="price price-item--regular">
                                    <PriceMoney amount={(item.original_line_price as number) / 100} />
                                  </s>
                                </dd>
                                <dt className="visually-hidden">Sale price</dt>
                                <dd className="price">
                                  <PriceMoney amount={item.line_price / 100} />
                                </dd>
                              </dl>
                            ) : (
                              <dd className="price">
                                <PriceMoney amount={item.line_price / 100} />
                              </dd>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mini-cart__footer">
              <div className="mini-cart__actions">
                <details className="mini-cart__action disclosure-has-popup">
                  <summary>
                    <span>
                      <IconPen />
                      Note
                    </span>
                  </summary>
                  <div>
                    <button type="button" className="close" aria-label="Close" onClick={(e) => closeDetails(e.currentTarget)}>
                      <IconClose />
                    </button>
                    <label htmlFor="Cart-note">Order special instructions</label>
                    <div className="mini-cart__note">
                      <div className="field">
                        <textarea
                          className="text-area text-area--resize-vertical field__input"
                          name="note"
                          id="Cart-note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                      <div>
                        <button className="button button--full-width" type="button" onClick={(e) => closeDetails(e.currentTarget)}>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </details>
                <details className="mini-cart__action disclosure-has-popup">
                  <summary>
                    <span>
                      <IconTruck />
                      Shipping
                    </span>
                  </summary>
                  <div>
                    <button type="button" className="close" aria-label="Close" onClick={(e) => closeDetails(e.currentTarget)}>
                      <IconClose />
                    </button>
                    <label htmlFor="ShippingCalculatorCountry">
                      Estimate shipping rates
                      <span className="mini-cart__question">
                        <span className="mini-cart__tooltip">Shipping & taxes will be calculated at checkout</span>
                      </span>
                    </label>
                    <p className="caption-large">Free standard shipping 14–21 days. Express 7–10 days.</p>
                  </div>
                </details>
              </div>

              <div className="taxes-discounts">
                <small className="tax-note caption-large rte">
                  Taxes and <a href={`${ORIGIN}/policies/shipping-policy`}>shipping</a> calculated at checkout
                </small>
              </div>

              <div className="gj-ship-banner">📦 Ships in 14–21 business days (7–10 with Express)</div>

              <div className="button-container">
                <button className="button" name="checkout" type="button" onClick={handleCheckout} disabled={checkingOut || isEmpty}>
                  {checkingOut ? 'Processing…' : 'Check out'}
                  <span className="price" id="mini-cart-subtotal">
                    ${dollars}.{cents} USD
                  </span>
                </button>
                {checkoutError && (
                  <p role="alert" className="cart-item__error form__message errors">
                    {checkoutError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}
