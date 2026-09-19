'use client';

import { useEffect, useRef, useState } from 'react';

/* Drives Shopify's real country/currency switcher: the same POST to
   /localization the theme's footer makes. It only resolves through the App
   Proxy (same-origin with the storefront, like /cart.js) — Shopify handles
   that path directly, our app never sees it. On localhost, or anywhere else
   not proxied, our own Next.js server receives the POST instead and has no
   route for it, so it fails.

   This is sent via fetch rather than a native form submission on purpose: a
   native submit is a real browser navigation, so a failing response (e.g.
   Next's dev 500 page) replaces the whole document with an error page before
   any of our JS gets a chance to react. fetch lets us catch that failure and
   recover, only navigating for real once we know the POST succeeded. */

const COUNTRIES = [
  { code: 'CA', currency: 'CAD', label: 'Canada (CAD $)' },
  { code: 'US', currency: 'USD', label: 'United States (USD $)' },
];

function IconGlobe() {
  return (
    <svg aria-hidden focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="m15 18 1-2-2.948-1.981-1.943-.124L10 15l2 3h3Z" stroke="currentColor" />
      <path
        d="M12.904 2.04A9.993 9.993 0 0 0 2.039 12.903c.414 4.754 4.303 8.643 9.057 9.057a9.993 9.993 0 0 0 10.865-10.865c-.414-4.753-4.303-8.642-9.057-9.057Z"
        stroke="currentColor"
      />
      <path d="M3 7.46 7.75 11l1.178-2.324 4.686-1.17L15 2" stroke="currentColor" />
    </svg>
  );
}

function IconCaret({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="10"
      height="7"
      viewBox="0 0 24 15"
      fill="none"
      className="shrink-0 transition-transform duration-[250ms] ease-in-out"
      style={{ transform: open ? 'scaleY(-1)' : 'none' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Shopify's page-transition bar: a short track with a dark segment sweeping
   back and forth, shown over a blank page while the store reloads in the new
   currency. */
function SwitchingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Changing currency"
    >
      <style>{`
        @keyframes gj-locale-sweep {
          from { transform: translateX(0); }
          to { transform: translateX(120px); }
        }
      `}</style>
      <div className="relative h-[2px] w-[165px] overflow-hidden bg-[#e6e7e9]">
        <div
          className="absolute left-0 top-0 h-full w-[45px] bg-[#1c1d1f]"
          style={{ animation: 'gj-locale-sweep 0.9s ease-in-out infinite alternate' }}
        />
      </div>
    </div>
  );
}

export default function LocalizationSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('US');
  const [switching, setSwitching] = useState(false);
  const [failed, setFailed] = useState(false);
  // Controlled: a hidden input's value always mirrors its attribute, so an
  // imperative .value write gets undone on the next React render.
  const [target, setTarget] = useState({ countryCode: 'US', returnTo: '/' });
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // The storefront reports the active presentment currency on the cart.
  useEffect(() => {
    fetch('/cart.js', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((cart) => {
        const match = COUNTRIES.find((c) => c.currency === cart?.currency);
        if (match) setCurrent(match.code);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (code: string) => {
    if (code === current) return;
    // return_to is read here, in the click handler, rather than at render
    // time so server and client markup match (no window during SSR).
    setTarget({ countryCode: code, returnTo: window.location.pathname + window.location.search });
    setOpen(false);
    setSwitching(true);
  };

  // POST once the new field values and the overlay have committed. On
  // success, navigate for real — the POST already set the currency cookie,
  // so this reload just picks it up, matching the live theme's own
  // full-page-reload behavior. On failure, recover instead of leaving the
  // overlay stuck: nothing ever navigated away.
  useEffect(() => {
    if (!switching) return;
    let cancelled = false;
    (async () => {
      try {
        const body = new FormData(formRef.current!);
        const res = await fetch('/localization', { method: 'POST', body, credentials: 'same-origin' });
        if (cancelled) return;
        if (!res.ok) throw new Error(`/localization responded ${res.status}`);
        window.location.href = target.returnTo;
      } catch {
        if (cancelled) return;
        setSwitching(false);
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [switching, target.returnTo]);

  // Self-dismissing, same as a toast.
  useEffect(() => {
    if (!failed) return;
    const timer = window.setTimeout(() => setFailed(false), 4000);
    return () => window.clearTimeout(timer);
  }, [failed]);

  const active = COUNTRIES.find((c) => c.code === current) ?? COUNTRIES[1];

  return (
    <div ref={rootRef} className="relative" style={{ marginBottom: '20px' }}>
      {/* Never natively submitted — just a convenient, readable source of
          field values for the FormData built in the effect above. */}
      <form ref={formRef} aria-hidden hidden>
        <input type="hidden" name="form_type" value="localization" />
        <input type="hidden" name="utf8" value="✓" />
        <input type="hidden" name="_method" value="put" />
        <input type="hidden" name="return_to" value={target.returnTo} readOnly />
        <input type="hidden" name="country_code" value={target.countryCode} readOnly />
      </form>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="FooterCountryList"
        aria-label="Country/region"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 py-[10px] text-[14px] leading-[1.8] tracking-[0.4px] text-[#1c1d1f] cursor-pointer mr-1"
      >
        <IconGlobe />
        <div className='group relative inline-block cursor-pointer'>
          <span
            className="whitespace-nowrap"
            style={open ? { boxShadow: 'inset 0 -1px 0 currentColor', fontSize: '13px' } : { fontSize: '13px' }}
          >
            {active.label}
          </span>
          <span className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#1c1d1f] transition-transform duration-300 ease-out group-hover:scale-x-100"></span>

        </div>
        <IconCaret open={open} />
      </button>

      {open && (
        <ul
          id="FooterCountryList"
          role="list"
          className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-[2] w-max min-w-[120px] max-w-[220px] min-h-[82px] border border-[#e6e7e9] bg-white text-[14px]"
          // Inline: `.gj-theme ul { padding: 0 }` outranks the padding utilities.
          style={{ padding: '8px 20px', animation: 'gj-locale-in 250ms ease' }}
        >
          {/* <style>{`
            @keyframes gj-locale-in {
              from { opacity: 0; transform: translate(-50%, 6px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style> */}
          {COUNTRIES.map((c) => {
            const isCurrent = c.code === current;
            return (
              <li key={c.code} className="flex py-[6px]">
                <button
                  type="button"
                  onClick={() => select(c.code)}
                  aria-current={isCurrent ? 'true' : undefined}
                  disabled={isCurrent}
                  className="block whitespace-nowrap leading-[1.4] text-[#1c1d1f] disabled:opacity-40 disabled:pointer-events-none hover:underline"
                >
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {switching && <SwitchingOverlay />}

      {failed && (
        <div
          role="alert"
          className="absolute bottom-[calc(100%+10px)] right-0 z-[2] w-max max-w-[260px] border border-[#e6e7e9] bg-white text-[12px] text-[#1c1d1f] shadow-sm"
          style={{ padding: '8px 12px' }}
        >
          Couldn&apos;t change currency — please try again.
        </div>
      )}
    </div>
  );
}
