'use client';

import { SIZE_OPTIONS } from '@/data';
import { computeJerseyPrice } from '@/lib/pricing';

interface ConfiguratorUIProps {
  sizeOptionData: readonly any[];
  sizeOptionValue: number | undefined;
  setSizeOptionValue: (v: number) => void;
  sportsTypeData: any[];
  sportsTypeValue: string | undefined;
  setSportsTypeValue: (v: string) => void;
  configurationData: any;

  selectedSport: string;
  setSelectedSport: (v: string) => void;

  name: string;
  setName: (v: string) => void;
  number: string;
  setNumber: (v: string) => void;
  outlineColor: string;
  setOutlineColor: (v: string) => void;
  nameColor: string;
  setNameColor: (v: string) => void;
  numberColor: string;
  setNumberColor: (v: string) => void;
  backboardColor: string;
  setBackboardColor: (v: string) => void;
    isDark: boolean;
  setIsDark: (v: boolean) => void;
  neonOn: boolean;
  setNeonOn: (v: boolean) => void;
  quantity: number;
  setQuantity: (v: number) => void;
  onAddToCart?: () => void;
  addingToCart?: boolean;
  addToCartError?: string | null;
}

/** Exact colors from glowjerseys.com/products/custom-jersey */
const jerseyColors = [
  { name: 'Yellow', hex: '#FFE800' },
    { name: 'Orange', hex: '#FF8A00' },
  { name: 'Ice Blue', hex: '#2CC5F5' },
  { name: 'Green', hex: '#17D63A' },
  { name: 'Red', hex: '#FF1A15' },
  { name: 'Blue', hex: '#0A46FF' },
  { name: 'Purple', hex: '#8A16FF' },
  { name: 'Pink', hex: '#FF2E9A' },
  { name: 'Neutral White', hex: '#E8C07A' },
  { name: 'White', hex: '#FFFFFF' },
];

const SPORTS = ['Baseball', 'Basketball', 'Football', 'Soccer', 'Hockey'] as const;

const backboardOptions = [
  { name: 'Transparent', hex: 'transparent' },
  { name: 'Black', hex: '#111111' },
   { name: 'Yellow', hex: '#FFE800' },
  { name: 'Orange', hex: '#FF8A00' },
  { name: 'Ice Blue', hex: '#2CC5F5' },
  { name: 'Green', hex: '#17D63A' },
  { name: 'Red', hex: '#FF1A15' },
  { name: 'Blue', hex: '#0A46FF' },
  { name: 'Purple', hex: '#8A16FF' },
  { name: 'Pink', hex: '#FF2E9A' },
  { name: 'Neutral White', hex: '#E8C07A' },
  { name: 'White', hex: '#FFFFFF' },
];

const ConfiguratorUI = ({
  sizeOptionData,
  sizeOptionValue,
  setSizeOptionValue,
  name,
  setName,
  number,
  setNumber,
  outlineColor,
  setOutlineColor,
  nameColor,
  setNameColor,
  numberColor,
  setNumberColor,
  backboardColor,
  setBackboardColor,
  selectedSport,
  setSelectedSport,
    isDark,
  setIsDark,
  neonOn,
  setNeonOn,
  quantity,
  setQuantity,
  onAddToCart,
  addingToCart,
  addToCartError,
}: ConfiguratorUIProps) => {
  const nameLen = name?.length ?? 0;
  const numberLen = number?.length ?? 0;

  const price = computeJerseyPrice(sizeOptionValue ?? 20);
  const [priceDollars, priceCents] = price.toFixed(2).split('.');

  const segmentActive =
    'border-[#0b45ff] bg-[rgba(11,69,255,0.12)] text-[#0b45ff] shadow-[inset_0_0_0_1px_#0b45ff]';
  const segmentIdle =
    'border-[#c7ccd1] bg-white text-gray-800 hover:border-gray-400';

  const swatchSelected =
    'scale-[1.14] border-white shadow-[0_0_0_2px_#000,0_0_0_4px_#fff,0_0_13px_1px_currentColor] z-10';
  const swatchIdle = 'border-[rgba(0,0,0,0.12)]';


  return (
    <div
      className="w-full text-gray-900"
      style={{
        fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        padding: '30px',
      }}
    >
      {/* Title + Price — Bayon matches live product title / price */}
      <h1
        className="leading-none uppercase"
        style={{
          fontFamily: 'Bayon, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(1.75rem, 2.2vw, 2.5rem)',
          letterSpacing: '0.04em',
          color: '#0e0f11',
        }}
      >
        CUSTOM GLOW JERSEY
      </h1>

      <p
        className="mt-2 leading-none"
        style={{
          fontFamily: 'Bayon, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(1.5rem, 1.8vw, 1.8rem)',
          letterSpacing: '0.06em',
          color: '#0e0f11',
        }}
      >
        ${priceDollars}
        <sup style={{ fontSize: '55%', letterSpacing: 0 }}>.{priceCents}</sup>
      </p>

      <p
        className="mt-2"
        style={{ fontSize: '13px', letterSpacing: '0.04em', color: 'rgba(28,29,31,0.65)' }}
      >
        Shipping calculated at checkout.
      </p>

      <p
        className="mt-1"
        style={{ fontSize: '13px', letterSpacing: '0.02em', color: 'rgba(28,29,31,0.75)' }}
      >
        4 interest-free installments, or from $14.89/mo with{' '}
        <span className="underline cursor-pointer" style={{ color: '#0b45ff' }}>
          shop
        </span>
      </p>

      {/* ── SIZE ─────────────────────────────────────────── */}
      <div className="mt-6">
        <p
          className="font-bold uppercase text-gray-800 mb-1.5"
          style={{ fontSize: '11px', letterSpacing: '0.6px' }}
        >
          SIZE
        </p>
        <div className="flex gap-2">
          {(sizeOptionData?.length ? sizeOptionData : SIZE_OPTIONS).map((option: any) => {
            const isActive = sizeOptionValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSizeOptionValue(option.value)}
                className={`px-4 py-2 text-sm font-semibold transition-all border ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.value} {option.unit || 'inch'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SPORT ────────────────────────────────────────── */}
      <div className="mt-5">
        <p
          className="font-bold uppercase text-gray-800 mb-1.5 flex items-center gap-1"
          style={{ fontSize: '11px', letterSpacing: '0.6px' }}
        >
          SPORT <span className="text-[#ff6a6a]">*</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SPORTS.map((sport) => {
            const isActive = selectedSport === sport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => setSelectedSport(sport)}
                className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-[9px] font-semibold border transition-all ${
                  isActive ? segmentActive : segmentIdle
                }`}
                style={{ fontSize: '12.5px' }}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NAME & NUMBER ────────────────────────────────── */}
      <div className="mt-5">
        <p
          className="font-bold uppercase text-gray-800 mb-1.5 flex items-center gap-1"
          style={{ fontSize: '11px', letterSpacing: '0.6px' }}
        >
          NAME & NUMBER <span className="text-[#ff6a6a]">*</span>
        </p>
        <div className="flex gap-2.5 items-start">
          <div className="flex-[3_1_0%]">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const v = e.target.value.slice(0, 13).toUpperCase();
                setName(v);
              }}
              maxLength={13}
              placeholder="NAME"
              autoComplete="off"
              className="w-full rounded-[9px] border border-[#8a8f98] bg-white outline-none focus:border-[#0b45ff] placeholder:opacity-40"
              style={{
                padding: '11px 12px',
                fontSize: '15px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            />
            <p
              className="mt-1 text-right text-gray-400"
              style={{ fontSize: '10px', letterSpacing: '0.3px' }}
            >
              {nameLen}/13 characters
            </p>
          </div>
          <div className="flex-[1_1_0%] min-w-[66px]">
            <input
              type="text"
              value={number}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setNumber(v);
              }}
              maxLength={4}
              placeholder="##"
              autoComplete="off"
              className="w-full rounded-[9px] border border-[#8a8f98] bg-white outline-none focus:border-[#0b45ff] placeholder:opacity-40 text-center"
              style={{
                padding: '11px 12px',
                fontSize: '15px',
                textTransform: 'uppercase',
              }}
            />
            <p
              className="mt-1 text-right text-gray-400"
              style={{ fontSize: '10px', letterSpacing: '0.3px' }}
            >
              {numberLen}/4 digits
            </p>
          </div>
        </div>
      </div>

      {/* ── JERSEY COLOR ─────────────────────────────────── */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-1.5">
          <p
            className="font-bold uppercase text-gray-800 flex items-center gap-1"
            style={{ fontSize: '11px', letterSpacing: '0.6px' }}
          >
            JERSEY COLOR <span className="text-[#ff6a6a]">*</span>
          </p>
          <em
            className="not-italic font-semibold text-gray-500 opacity-70"
            style={{ fontSize: '11px' }}
          >
            {jerseyColors.find(
              (c) => c.hex.toLowerCase() === outlineColor?.toLowerCase()
            )?.name || ''}
          </em>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {jerseyColors.map((c) => {
            const isActive = outlineColor?.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={`jersey-${c.hex}`}
                type="button"
                onClick={() => setOutlineColor(c.hex)}
                title={c.name}
                aria-label={c.name}
                className={`relative w-full aspect-square rounded-full border-2 transition-all cursor-pointer p-0 ${
                  isActive ? swatchSelected : swatchIdle
                }`}
                style={{
                  backgroundColor: c.hex,
                  color: c.hex,
                  boxShadow: isActive ? undefined : '0 0 6px -1px currentColor',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── NAME COLOR ───────────────────────────────────── */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-1.5">
          <p
            className="font-bold uppercase text-gray-800 flex items-center gap-1"
            style={{ fontSize: '11px', letterSpacing: '0.6px' }}
          >
            NAME COLOR <span className="text-[#ff6a6a]">*</span>
          </p>
          <em
            className="not-italic font-semibold text-gray-500 opacity-70"
            style={{ fontSize: '11px' }}
          >
            {jerseyColors.find(
              (c) => c.hex.toLowerCase() === nameColor?.toLowerCase()
            )?.name || ''}
          </em>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {jerseyColors.map((c) => {
            const isActive = nameColor?.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={`name-${c.hex}`}
                type="button"
                onClick={() => setNameColor(c.hex)}
                title={c.name}
                aria-label={c.name}
                className={`relative w-full aspect-square rounded-full border-2 transition-all cursor-pointer p-0 ${
                  isActive ? swatchSelected : swatchIdle
                }`}
                style={{
                  backgroundColor: c.hex,
                  color: c.hex,
                  boxShadow: isActive ? undefined : '0 0 6px -1px currentColor',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── NUMBER COLOR ─────────────────────────────────── */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-1.5">
          <p
            className="font-bold uppercase text-gray-800 flex items-center gap-1"
            style={{ fontSize: '11px', letterSpacing: '0.6px' }}
          >
            NUMBER COLOR <span className="text-[#ff6a6a]">*</span>
          </p>
          <em
            className="not-italic font-semibold text-gray-500 opacity-70"
            style={{ fontSize: '11px' }}
          >
            {jerseyColors.find(
              (c) => c.hex.toLowerCase() === numberColor?.toLowerCase()
            )?.name || ''}
          </em>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {jerseyColors.map((c) => {
            const isActive = numberColor?.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={`number-${c.hex}`}
                type="button"
                onClick={() => setNumberColor(c.hex)}
                title={c.name}
                aria-label={c.name}
                className={`relative w-full aspect-square rounded-full border-2 transition-all cursor-pointer p-0 ${
                  isActive ? swatchSelected : swatchIdle
                }`}
                style={{
                  backgroundColor: c.hex,
                  color: c.hex,
                  boxShadow: isActive ? undefined : '0 0 6px -1px currentColor',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── BACKBOARD ────────────────────────────────────── */}
<div className="mt-5">
  <div className="flex items-baseline justify-between mb-1.5">
    <p
      className="font-bold uppercase text-gray-800 flex items-center gap-1"
      style={{ fontSize: '11px', letterSpacing: '0.6px' }}
    >
      BACKBOARD <span className="text-[#ff6a6a]">*</span>
    </p>
    <em
      className="not-italic font-semibold text-gray-500 opacity-70"
      style={{ fontSize: '11px' }}
    >
      {backboardOptions.find(
        (c) =>
          c.hex.toLowerCase() === backboardColor?.toLowerCase() ||
          (c.hex === 'transparent' &&
            (backboardColor === 'transparent' || backboardColor === 'Transparent'))
      )?.name || ''}
    </em>
  </div>

  <div className="grid grid-cols-10 gap-1.5">
    {backboardOptions.map((c) => {
      const isTransparent = c.hex === 'transparent';
      const isActive =
        backboardColor?.toLowerCase() === c.hex.toLowerCase() ||
        (isTransparent &&
          (backboardColor === 'transparent' || backboardColor === 'Transparent'));

      return (
        <button
          key={`backboard-${c.hex}`}
          type="button"
          onClick={() => setBackboardColor(c.hex)}
          title={c.name}
          aria-label={c.name}
          className={`relative w-full aspect-square rounded-full border-2 transition-all cursor-pointer p-0 ${
            isActive ? swatchSelected : swatchIdle
          }`}
          style={{
            backgroundColor: isTransparent ? undefined : c.hex,
            backgroundImage: isTransparent
              ? 'conic-gradient(#cfcfcf 25%, #fff 0 50%, #cfcfcf 0 75%, #fff 0)'
              : undefined,
            backgroundSize: isTransparent ? '8px 8px' : undefined,
            color: isTransparent ? '#888' : c.hex,
            boxShadow: isActive ? undefined : '0 0 6px -1px currentColor',
          }}
        />
      );
    })}
  </div>
</div>

{/* ── SCENE CONTROLS ──────────────────────────────── */}
{/* <div className="flex gap-2 mb-5">
  <button
    type="button"
    onClick={() => setIsDark(!isDark)}
    className="flex-1 py-2.5 rounded-[9px] text-[12.5px] font-semibold border border-[#c7ccd1] bg-white text-gray-800 hover:border-gray-400 transition-all"
  >
    {isDark ? 'Switch to Day' : 'Switch to Night'}
  </button>

</div> */}

{/* ── QUANTITY + ADD TO CART ───────────────────────── */}
<div className="mt-6 flex items-center gap-3">
  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
    <button
      type="button"
      className="w-10 h-11 text-lg text-gray-600 hover:bg-gray-50"
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
    >
      −
    </button>
    <span className="w-10 h-11 flex items-center justify-center text-sm font-medium border-x border-gray-300">
      {quantity}
    </span>
    <button
      type="button"
      className="w-10 h-11 text-lg text-gray-600 hover:bg-gray-50"
      onClick={() => setQuantity(Math.min(99, quantity + 1))}
    >
      +
    </button>
  </div>

  <button
  type="button"
  onClick={onAddToCart}
  disabled={addingToCart}
  className="flex-1 h-11 rounded-md bg-[#0b45ff] text-white text-sm font-bold tracking-wide hover:bg-[#0939d6] transition disabled:opacity-80 disabled:cursor-wait inline-flex items-center justify-center gap-2"
>
  {addingToCart && (
    <svg
      aria-hidden="true"
      className="w-4 h-4 animate-spin text-white/30 fill-white"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  )}
  {addingToCart ? '' : 'ADD TO CART'}
</button>
</div>
{addToCartError && (
  <p className="mt-2 text-xs text-red-600" role="alert">
    {addToCartError}
  </p>
)}

{/* ── ACCORDIONS ───────────────────────────────────── */}
<div className="mt-6 border-t border-gray-200">
  {/* Sizes */}
  <details className="group border-b border-gray-200">
    <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-sm font-medium text-gray-800">
      <span className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16M4 12h10M4 17h14" />
        </svg>
        SIZES
      </span>
      <svg className="w-4 h-4 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </summary>
    <div className="pb-4 text-sm text-gray-600 leading-relaxed space-y-3">
      <div>
        <p className="font-semibold text-gray-800 mb-1">STANDARD</p>
        <p>Baseball: 19.69 × 17.40 in</p>
        <p>Basketball: 13.61 × 20.19 in</p>
        <p>Football: 19.69 × 16.15 in</p>
        <p>Hockey: 16.18 × 20.19 in</p>
        <p>Soccer: 20.19 × 18.14 in</p>
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-1">LARGE</p>
        <p>Baseball: 30.0 × 26.51 in</p>
        <p>Basketball: 20.0 × 30.0 in</p>
        <p>Football: 30.0 × 24.61 in</p>
        <p>Hockey: 24.44 × 30.0 in</p>
        <p>Soccer: 26.96 × 30.0 in</p>
      </div>
    </div>
  </details>

  {/* What's in the box */}
  <details className="group border-b border-gray-200">
    <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-sm font-medium text-gray-800">
      <span className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        WHAT&apos;S IN THE BOX?
      </span>
      <svg className="w-4 h-4 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </summary>
    <ul className="pb-4 text-sm text-gray-600 list-disc pl-5 space-y-1">
      <li>Remote Control</li>
      <li>Easy To Assemble Mounting Kit</li>
    </ul>
  </details>

  {/* Shipping */}
  <details className="group border-b border-gray-200">
    <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-sm font-medium text-gray-800">
      <span className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
        SHIPPING DETAILS
      </span>
      <svg className="w-4 h-4 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </summary>
    <div className="pb-4 text-sm text-gray-600 space-y-1">
      <p>Free Shipping (14–21 Days)</p>
      <p>Express Shipping (7–10 Days)</p>
    </div>
  </details>
</div>

{/* ── REFUND NOTE — matches live product footer note */}
<p
  className="mt-5 leading-relaxed uppercase"
  style={{
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: 'rgba(28,29,31,0.55)',
    fontFamily: 'Poppins, sans-serif',
  }}
>
  Custom Glow Jerseys are not refundable, returnable, or replaceable.
  Please make sure all details are correct.
</p>

    </div>
  );
};

export default ConfiguratorUI;