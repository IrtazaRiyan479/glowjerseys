'use client';

import { useCartStore } from '@/store/cartStore';
import { getAppApiPath } from '@/lib/appProxyPath';
import { useEffect, useState } from 'react';

const ORIGIN = 'https://glowjerseys.com';

const RECS = [
  {
    title: 'Booker #15',
    price: '119.99',
    href: `${ORIGIN}/products/booker-1`,
    img: 'https://cdn.shopify.com/s/files/1/0609/3399/6637/files/Gemini_Generated_Image_yo6udxyo6udxyo6u.png?width=140',
  },
  {
    title: 'James #23',
    price: '119.99',
    href: `${ORIGIN}/products/james-23`,
    img: 'https://cdn.shopify.com/s/files/1/0609/3399/6637/files/Gemini_Generated_Image_gtfz7igtfz7igtfz.png?width=140',
  },
  {
    title: 'Mccaffrey #23',
    price: '107.99',
    compareAt: '119.99',
    href: `${ORIGIN}/products/mccaffrey-23`,
    img: 'https://cdn.shopify.com/s/files/1/0609/3399/6637/files/Gemini_Generated_Image_lu33yhlu33yhlu33.png?width=140',
  },
  {
    title: 'Murray #27',
    price: '119.99',
    href: `${ORIGIN}/products/murray-27`,
    img: 'https://cdn.shopify.com/s/files/1/0609/3399/6637/files/Gemini_Generated_Image_pawly1pawly1pawl.png?width=140',
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

function Price({ amount, className = '' }: { amount: number | string; className?: string }) {
  const n = typeof amount === 'number' ? amount : parseFloat(amount);
  const [dollars, cents] = n.toFixed(2).split('.');
  return (
    <span className={`price ${className}`}>
      <bdi>
        ${dollars}
        <sup>.{cents}</sup>
      </bdi>
    </span>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="w-4 h-4 animate-spin text-black/20 fill-black"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: 8 }}
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
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
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-truck" fill="none" viewBox="0 0 24 24" width="14" height="14">
      <path d="M1 3h13v13H1V3zm13 3h5l4 4v6h-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="5.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18.5" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function Recs() {
  return (
    <div className="cart-recommendations">
      <div className="title h5">You may also like</div>
      <ul className="mini-cart__navigation">
        {RECS.map((r) => (
          <li key={r.title}>
            <div className="product-container">
              <a href={r.href} className="product-image">
                <img src={r.img} alt={r.title} />
              </a>
              <div className="product-description">
                <div className="caption-with-letter-spacing">Glow Jerseys</div>
                <div className="product-content">
                  <a href={r.href} className="link">
                    {r.title}
                  </a>
                </div>
                <div className="price">
                  {r.compareAt ? (
                    <>
                      <span className="price-item--regular">
                        <Price amount={r.compareAt} />
                      </span>
                      <span className="from-label">From</span>
                      <span className="price-item--sale">
                        <Price amount={r.price} />
                      </span>
                    </>
                  ) : (
                    <Price amount={r.price} />
                  )}
                </div>
                <div className="product-button">
                  <a href={r.href} className="button">
                    Choose options
                    <span aria-hidden>→</span>
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

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const carts = useCartStore((s) => s.carts);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal);
  const storefrontItems = useCartStore((s) => s.storefrontItems);
  const refreshStorefrontCart = useCartStore((s) => s.refreshStorefrontCart);
  const updateStorefrontItem = useCartStore((s) => s.updateStorefrontItem);

  const [shown, setShown] = useState(isOpen);
  const [entered, setEntered] = useState(false);
  const [note, setNote] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [storefrontUpdatingKey, setStorefrontUpdatingKey] = useState<string | null>(null);
  const [storefrontError, setStorefrontError] = useState<string | null>(null);

  // Fetched once on mount (this component is always mounted in the layout)
  // so the nav bar badge reflects the real cart even before the drawer's
  // ever been opened, then refreshed each time the drawer opens in case it
  // changed elsewhere (e.g. added via the real theme in another tab).
  useEffect(() => {
    refreshStorefrontCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShown(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      document.body.style.overflow = 'hidden';
      refreshStorefrontCart();
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    document.body.style.overflow = '';
    const t = window.setTimeout(() => setShown(false), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!shown) return null;

  const total = subtotal();
  const isEmpty = carts.length === 0 && storefrontItems.length === 0;
  const [dollars, cents] = total.toFixed(2).split('.');

  const handleStorefrontQuantityChange = async (key: string, quantity: number) => {
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
      const res = await fetch(getAppApiPath('/api/create-draft-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: carts.map((line) => ({
            selectedOptions: line.selectedOptions,
            quantity: line.quantity,
          })),
          storefrontCartLines: storefrontItems.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.invoiceUrl) {
        throw new Error(data.error || 'Checkout failed.');
      }
      window.location.href = data.invoiceUrl;
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
              <button type="button" className="header__icon header__icon--summary header__icon--cart" aria-label="Close" onClick={closeCart}>
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
                <p role="alert" style={{ color: '#c0392b', fontSize: '12px', margin: '0 0 8px' }}>
                  {storefrontError}
                </p>
              )}
              <ul className="mini-cart__navigation">
                {storefrontItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className="delete-product"
                      aria-label="Remove"
                      disabled={storefrontUpdatingKey === item.key}
                      onClick={() => handleStorefrontQuantityChange(item.key, 0)}
                    >
                      <IconClose />
                    </button>
                    <div className="product-container">
                      <div className="product-image">
                        {item.image ? <img src={item.image} alt={item.product_title} /> : null}
                      </div>
                      <div className="product-description">
                        <div className="product-content">
                          <a href={item.url} className="link">
                            {item.product_title}
                          </a>
                        </div>
                        {item.variant_title && (
                          <dl>
                            <div className="product-option">
                              <dt>Variant:</dt>
                              <dd>{item.variant_title}</dd>
                            </div>
                          </dl>
                        )}
                        <div className="product-quantity">
                          <div className="quantity" style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="quantity__button"
                              aria-label="Decrease"
                              disabled={storefrontUpdatingKey === item.key}
                              onClick={() => handleStorefrontQuantityChange(item.key, item.quantity - 1)}
                            >
                              −
                            </button>
                            <input
                              className="quantity__input"
                              type="number"
                              readOnly
                              value={item.quantity}
                              aria-label="Quantity"
                            />
                            <button
                              type="button"
                              className="quantity__button"
                              aria-label="Increase"
                              disabled={storefrontUpdatingKey === item.key}
                              onClick={() => handleStorefrontQuantityChange(item.key, item.quantity + 1)}
                            >
                              +
                            </button>
                            {storefrontUpdatingKey === item.key && <Spinner />}
                          </div>
                          <Price amount={item.line_price / 100} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {carts.map((line) => {
                  const o = line.selectedOptions;
                  const title = line.productTitle;
                  return (
                    <li key={line.id}>
                      <button type="button" className="delete-product" aria-label="Remove" onClick={() => removeItem(line.id)}>
                        <IconClose />
                      </button>
                      <div className="product-container">
                        <div className="product-image">
                          {o.previewImageUrl ? <img src={o.previewImageUrl} alt={title} /> : null}
                        </div>
                        <div className="product-description">
                          <div className="product-content">
                            <span className="link">{title}</span>
                          </div>
                          <dl>
                            <div className="product-option">
                              <dt>SIZE:</dt>
                              <dd>{o.size} inch</dd>
                            </div>
                            <div className="product-option">
                              <dt>Backboard:</dt>
                              <dd>{getColorName(o.backboardColor)}</dd>
                            </div>
                            <div className="product-option">
                              <dt>Sport:</dt>
                              <dd>{o.sport}</dd>
                            </div>
                            <div className="product-option">
                              <dt>Custom Name &amp; Number:</dt>
                              <dd>{o.name ? `${o.name} #${o.number}` : '—'}</dd>
                            </div>
                            <div className="product-option">
                              <dt>Jersey Color:</dt>
                              <dd>{getColorName(o.jerseyColor)}</dd>
                            </div>
                            <div className="product-option">
                              <dt>Name Color:</dt>
                              <dd>{getColorName(o.nameColor)}</dd>
                            </div>
                            <div className="product-option">
                              <dt>Number Color:</dt>
                              <dd>{getColorName(o.numberColor)}</dd>
                            </div>
                          </dl>
                          <div className="product-quantity">
                            <div className="quantity">
                              <button
                                type="button"
                                className="quantity__button"
                                aria-label="Decrease"
                                onClick={() => updateQuantity(line.id, line.quantity - 1)}
                              >
                                −
                              </button>
                              <input
                                className="quantity__input"
                                type="number"
                                readOnly
                                value={line.quantity}
                                aria-label="Quantity"
                              />
                              <button
                                type="button"
                                className="quantity__button"
                                aria-label="Increase"
                                onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <Price amount={line.unitPrice * line.quantity} />
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
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={(e) => (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')}
                    >
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
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={(e) => (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')}
                    >
                      <IconClose />
                    </button>
                    <p className="caption-large">
                      Free standard shipping 14–21 days. Express 7–10 days.
                    </p>
                  </div>
                </details>
              </div>

              <div className="taxes-discounts">
                <small className="tax-note caption-large rte">
                  Taxes and{' '}
                  <a href={`${ORIGIN}/policies/shipping-policy`}>shipping</a> calculated at checkout
                </small>
              </div>

             <div className="gj-ship-banner">📦 Ships in 14–21 business days (7–10 with Express)</div>

              <div className="button-container">
                <button
                  className="button"
                  name="checkout"
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkingOut || isEmpty}
                >
                  {checkingOut ? 'Processing…' : 'Check out'}
                  <span id="mini-cart-subtotal">
                    ${dollars}.{cents} USD
                  </span>
                </button>
                {checkoutError && (
                  <p role="alert" style={{ color: '#c0392b', fontSize: '12px', marginTop: '8px' }}>
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