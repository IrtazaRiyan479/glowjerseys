'use client';

import { useCartStore } from '@/store/cartStore';
import { updateStorefrontCartNote } from '@/lib/shopify/storefrontCart';
import { SIZE_OPTIONS, numericVariantId } from '@/data';
import { useEffect, useState } from 'react';

const JERSEY_VARIANT_IDS = new Set(SIZE_OPTIONS.map((o) => numericVariantId(o.variantId)));

const ORIGIN = 'https://glowjerseys.com';

/** Fake lines for UI preview when /cart.js is empty. Set false before shipping. */
const PREVIEW_CART = true;

const DEMO_ITEMS = [
  {
    key: 'demo-jefferson',
    variant_id: 1,
    product_title: 'Jefferson #18',
    variant_title: '20 inches',
    quantity: 1,
    price: 10799,
    line_price: 10799,
    image:
      'https://cdn.shopify.com/s/files/1/0609/3399/6637/files/Gemini_Generated_Image_yo6udxyo6udxyo6u.png?width=140',
    url: `${ORIGIN}/products/jefferson-18`,
    properties: null as Record<string, string> | null,
  },
  {
    key: 'demo-custom',
    variant_id: numericVariantId(SIZE_OPTIONS[0].variantId),
    product_title: 'Custom Glow Jersey',
    variant_title: '20 inch',
    quantity: 1,
    price: 16499,
    line_price: 16499,
    image: null as string | null,
    url: `${ORIGIN}/products/custom-jersey`,
    properties: {
      Size: '20 inch',
      Backboard: 'Black',
      Sport: 'Basketball',
      Name: 'BROWN',
      Number: '7',
      'Jersey Color': 'Orange',
      'Name Color': 'White',
      'Number Color': 'White',
      'Preview Image':
        'https://cdn.shopify.com/s/files/1/0609/3399/6637/files/Gemini_Generated_Image_gtfz7igtfz7igtfz.png?width=140',
    },
  },
];

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

function IconMinus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-minus" fill="none" viewBox="0 0 10 2">
      <path fill="currentColor" d="M1 1h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" className="icon icon-plus" fill="none" viewBox="0 0 10 10">
      <path fill="currentColor" d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
    <span>Choose options</span>
    <IconArrow />
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
  const subtotal = useCartStore((s) => s.subtotal);
  const storefrontItems = useCartStore((s) => s.storefrontItems);
  const refreshStorefrontCart = useCartStore((s) => s.refreshStorefrontCart);
  const updateStorefrontItem = useCartStore((s) => s.updateStorefrontItem);

  const [shown, setShown] = useState(isOpen);
  const [demoItems, setDemoItems] = useState(DEMO_ITEMS);
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

    const usingDemo = PREVIEW_CART;
  const items = usingDemo ? demoItems : storefrontItems;
  const total = usingDemo
    ? demoItems.reduce((n, i) => n + i.line_price, 0) / 100
    : subtotal();
  const isEmpty = items.length === 0;
  const [dollars, cents] = total.toFixed(2).split('.');

  const handleStorefrontQuantityChange = async (key: string, quantity: number) => {
        setStorefrontError(null);
    if (!usingDemo) setStorefrontUpdatingKey(key);

    if (usingDemo) {
      setDemoItems((prev) =>
        prev
          .map((i) =>
            i.key === key
              ? { ...i, quantity: Math.max(0, quantity), line_price: i.price * Math.max(0, quantity) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
      return;
    }
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
      if (note) {
        await updateStorefrontCartNote(note);
      }
      // Everything (jerseys and regular products) is already genuinely in
      // Shopify's real cart by this point, so checkout is just Shopify's
      // own native checkout — no custom order-building needed here. A full
      // navigation is required (not useRouter/next/link): /checkout is a
      // Shopify-native route outside this Next.js app entirely.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/checkout';
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
                <p role="alert" style={{ color: '#c0392b', fontSize: '12px', margin: '0 0 8px' }}>
                  {storefrontError}
                </p>
              )}
              <ul className="mini-cart__navigation">
                {items.map((item) => {
                  const isJersey = JERSEY_VARIANT_IDS.has(item.variant_id);
                  const p = item.properties ?? {};
                  const image = isJersey ? p['Preview Image'] || null : item.image;
                  return (
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
                          {image ? <img src={image} alt={item.product_title} /> : null}
                        </div>
                        <div className="product-description">
                          <div className="product-content">
                            <a href={item.url} className="link">
                              {item.product_title}
                            </a>
                          </div>
                          {isJersey ? (
                            <dl>
                              <div className="product-option">
                                <dt>SIZE:</dt>
                                <dd>{p['Size']}</dd>
                              </div>
                              <div className="product-option">
                                <dt>Backboard:</dt>
                                <dd>{getColorName(p['Backboard'])}</dd>
                              </div>
                              <div className="product-option">
                                <dt>Sport:</dt>
                                <dd>{p['Sport']}</dd>
                              </div>
                              <div className="product-option">
                                <dt>Custom Name &amp; Number:</dt>
                                <dd>{p['Name'] ? `${p['Name']} #${p['Number']}` : '—'}</dd>
                              </div>
                              <div className="product-option">
                                <dt>Jersey Color:</dt>
                                <dd>{getColorName(p['Jersey Color'])}</dd>
                              </div>
                              <div className="product-option">
                                <dt>Name Color:</dt>
                                <dd>{getColorName(p['Name Color'])}</dd>
                              </div>
                              <div className="product-option">
                                <dt>Number Color:</dt>
                                <dd>{getColorName(p['Number Color'])}</dd>
                              </div>
                            </dl>
                          ) : (
  item.variant_title && item.variant_title !== 'Default Title' && (
    <dl>
      <div className="product-option">
        <dt>Size:</dt>
        <dd>{item.variant_title}</dd>
      </div>
    </dl>
  )
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
                                <IconMinus />
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
                                <IconPlus />
                              </button>
                              {!usingDemo && storefrontUpdatingKey === item.key && <Spinner />}
                            </div>
                            <Price amount={item.line_price / 100} />
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