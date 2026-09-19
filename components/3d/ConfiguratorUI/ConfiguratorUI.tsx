'use client';

import { SIZE_OPTIONS, numericVariantId } from '@/data';
import { computeJerseyPrice, getSizeOption } from '@/lib/pricing';
import { fetchLocalizedProduct, formatPriceParts, type LocalizedProduct } from '@/lib/shopify/localizedPrice';
import { useEffect, useState } from 'react';

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

  const [localized, setLocalized] = useState<LocalizedProduct | null>(null);
  useEffect(() => {
    fetchLocalizedProduct().then(setLocalized);
  }, []);

  const currentSize = sizeOptionValue ?? 20;
  const localizedCents = localized?.pricesByVariantId[numericVariantId(getSizeOption(currentSize).variantId)];
  const price = localizedCents != null ? localizedCents / 100 : computeJerseyPrice(currentSize);
  const currency = localized?.currency ?? 'USD';
  const { symbol: priceSymbol, whole: priceDollars, fraction: priceCents } = formatPriceParts(price, currency);

  const segmentActive =
    'border-[#0b45ff] bg-[rgba(11,69,255,0.12)] text-[#0b45ff] shadow-[inset_0_0_0_1px_#0b45ff]';
  const segmentIdle =
    'border-[#c7ccd1] bg-white text-gray-800 hover:border-gray-400';

  const [openAcc, setOpenAcc] = useState<string | null>(null);

  const swatchSelected = 'gj-swatch is-active';
  const swatchIdle = 'gj-swatch';


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
      <h1
        className="m-0 leading-none uppercase"
        style={{
          fontFamily: 'Bayon, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(1.85rem, 2.4vw, 2.65rem)',
          letterSpacing: '0.02em',
          color: '#0e0f11',
        }}
      >
        CUSTOM GLOW JERSEY
      </h1>

      <p
        className="m-0 mt-3 leading-none"
        style={{
          fontFamily: 'Bayon, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(1.55rem, 2vw, 1.95rem)',
          letterSpacing: '0.13rem',
          color: '#0e0f11',
        }}
      >
        <span style={{ fontSize: '70%', marginRight: '0.15rem' }}>{priceSymbol}</span>
        {priceDollars}
        <sup style={{ fontSize: '55%', letterSpacing: 0, marginLeft: '1px' }}>.{priceCents}</sup>
      </p>

      <p
        className="m-0 mt-3"
        style={{ fontSize: '13px', letterSpacing: '0.04em', color: 'rgba(28,29,31,0.7)', lineHeight: 1.45 }}
      >
        <a href="/policies/shipping-policy" className="underline" style={{ color: 'inherit' }}>
          Shipping
        </a>{' '}
        calculated at checkout.
      </p>

      <p
        className="m-0 mt-2"
        style={{ fontSize: '13px', letterSpacing: '0.02em', color: 'rgba(28,29,31,0.8)', lineHeight: 1.45 }}
      >
        4 interest-free installments, or from <strong>$14.89</strong>/mo with{' '}
        <span style={{ color: '#5a31f4', fontWeight: 600, cursor: 'pointer' }}>shop</span>
        <span
          className="inline-flex items-center justify-center ml-0.5 align-middle"
          style={{ width: 16, height: 16, color: 'rgba(28,29,31,0.55)' }}
          title="Payment terms"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 7.25c-.69 0-1.25.56-1.25 1.25a.75.75 0 0 1-1.5 0 2.75 2.75 0 1 1 3.758 2.56.61.61 0 0 0-.226.147.154.154 0 0 0-.032.046.75.75 0 0 1-1.5-.003c0-.865.696-1.385 1.208-1.586A1.25 1.25 0 0 0 10 7.25Z" />
            <path d="M10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            <path fillRule="evenodd" d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" />
          </svg>
        </span>
      </p>

      {/* ── SIZE ─────────────────────────────────────────── */}
      <div className="mt-7">
        <p
          className="m-0 mb-2 font-bold uppercase text-gray-800"
          style={{ fontSize: '13px', letterSpacing: '0.1rem' }}
        >
          SIZE
        </p>
        <div className="flex flex-wrap gap-2">
          {(sizeOptionData?.length ? sizeOptionData : SIZE_OPTIONS).map((option: any) => {
            const isActive = sizeOptionValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSizeOptionValue(option.value)}
                className="min-w-[4rem] min-h-[2.5rem] px-4 py-1.5 text-sm font-medium transition-all"
                style={{
                  borderRadius: '3px',
                  letterSpacing: '0.1rem',
                  boxShadow: isActive
                    ? 'inset 0 0 0 2px #0e0f11'
                    : 'inset 0 0 0 1px #e6e7e9',
                  backgroundColor: isActive ? '#0e0f11' : '#fff',
                  color: isActive ? '#fff' : '#0e0f11',
                }}
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
                className={`flex-1 min-w-[58px] py-2 px-1.5 rounded-[9px] font-semibold border transition-all ${isActive ? segmentActive : segmentIdle
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
                className={isActive ? swatchSelected : swatchIdle}
                style={{ backgroundColor: c.hex, color: c.hex }}
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
                className={isActive ? swatchSelected : swatchIdle}
                style={{ backgroundColor: c.hex, color: c.hex }}
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
                className={isActive ? swatchSelected : swatchIdle}
                style={{ backgroundColor: c.hex, color: c.hex }} />
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
                className={isActive ? swatchSelected : swatchIdle}
                style={{
                  backgroundColor: isTransparent ? undefined : c.hex,
                  backgroundImage: isTransparent
                    ? 'conic-gradient(#cfcfcf 25%, #fff 0 50%, #cfcfcf 0 75%, #fff 0)'
                    : undefined,
                  backgroundSize: isTransparent ? '8px 8px' : undefined,
                  color: isTransparent ? '#888' : c.hex,
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
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-9 h-9 rounded-full text-gray-600 text-lg leading-none flex items-center justify-center hover:brightness-95"
            style={{ backgroundColor: '#efefef', border: 'none' }}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            className="w-9 h-9 rounded-full text-gray-600 text-lg leading-none flex items-center justify-center hover:brightness-95"
            style={{ backgroundColor: '#efefef', border: 'none' }}
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
          {addingToCart ? (
            <svg aria-hidden="true" className="w-4 h-4 animate-spin text-white/30 fill-white" viewBox="0 0 100 101" fill="none">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          ) : (
            'ADD TO CART'
          )}
        </button>
      </div>
      {addToCartError && (
        <p className="mt-2 text-xs text-red-600" role="alert">{addToCartError}</p>
      )}

      {/* ── ACCORDIONS — animated (Material Tailwind style) ───── */}
      <div className="mt-6">
        {/* SIZES */}
        <div className="product__accordion accordion border-t border-b border-gray-200">
          <button
            type="button"
            onClick={() => setOpenAcc(openAcc === 'sizes' ? null : 'sizes')}
            className="flex w-full items-center justify-between py-[1.5rem] cursor-pointer list-none bg-transparent border-0 p-0 text-left"
          >
            <span className="summary__title flex flex-1 items-center">
              <svg className="icon icon-accordion" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, marginRight: '1.2rem' }}>
                <path d="M18.9836 5.32852L14.6715 1.01638L1.01638 14.6715L5.32852 18.9836L18.9836 5.32852ZM15.3902 0.297691C14.9933 -0.0992303 14.3497 -0.0992303 13.9528 0.297691L0.297691 13.9528C-0.0992301 14.3497 -0.0992305 14.9932 0.297691 15.3902L4.60983 19.7023C5.00675 20.0992 5.65029 20.0992 6.04721 19.7023L19.7023 6.04721C20.0992 5.65029 20.0992 5.00675 19.7023 4.60983L15.3902 0.297691Z" fillRule="evenodd" />
                <path d="M11.7863 2.67056C11.9848 2.4721 12.3065 2.4721 12.505 2.67056L14.4237 4.58927C14.6222 4.78774 14.6222 5.1095 14.4237 5.30796C14.2252 5.50642 13.9035 5.50642 13.705 5.30796L11.7863 3.38925C11.5878 3.19079 11.5878 2.86902 11.7863 2.67056Z" />
                <path d="M8.93891 5.36331C9.13737 5.16485 9.45914 5.16485 9.6576 5.36331L11.5763 7.28202C11.7748 7.48048 11.7748 7.80225 11.5763 8.00071C11.3779 8.19917 11.0561 8.19917 10.8576 8.00071L8.93891 6.082C8.74045 5.88354 8.74045 5.56177 8.93891 5.36331Z" />
                <path d="M6.24307 8.20742C6.44153 8.00896 6.76329 8.00896 6.96175 8.20742L8.88047 10.1261C9.07893 10.3246 9.07893 10.6464 8.88047 10.8448C8.68201 11.0433 8.36024 11.0433 8.16178 10.8448L6.24307 8.92611C6.0446 8.72765 6.0446 8.40588 6.24307 8.20742Z" />
                <path d="M3.37296 10.8776C3.57142 10.6791 3.89319 10.6791 4.09165 10.8776L6.01036 12.7963C6.20882 12.9948 6.20882 13.3165 6.01036 13.515C5.8119 13.7134 5.49013 13.7134 5.29167 13.515L3.37296 11.5963C3.1745 11.3978 3.1745 11.076 3.37296 10.8776Z" />
              </svg>
              <span className="accordion__title uppercase" style={{ fontSize: '13px', letterSpacing: '0.3em' }}>Sizes</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" className={`icon icon-caret w-[12px] h-[8px] transition-transform duration-300 ${openAcc === 'sizes' ? 'scale-y-[-1]' : ''}`} fill="none" viewBox="0 0 24 15">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z" fill="currentColor" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: openAcc === 'sizes' ? '15rem' : '0' }}
          >
            <div className="pb-6 text-[14px] text-gray-600 leading-relaxed overflow-y-auto" style={{ maxHeight: '15rem' }}>
              <p className="mb-1"><span style={{ textDecoration: 'underline' }}><em><strong>STANDARD</strong></em></span></p>
              <p>Baseball: 19.69 x 17.40 in</p>
              <p>Basketball: 13.61 x 20.19 in</p>
              <p>Football: 19.69 x 16.15 in</p>
              <p>Hockey: 16.18 × 20.19in</p>
              <p className="mb-3">Soccer: 20.19 x 18.14 in</p>
              <p className="mb-1"><span style={{ textDecoration: 'underline' }}><em><strong>LARGE</strong></em></span></p>
              <p>Baseball: 30.0 x 26.51 in</p>
              <p>Basketball: 20.0 x 30.0 in</p>
              <p>Football: 30.0 x 24.61 in</p>
              <p>Hockey: 24.44 × 30.0in</p>
              <p>Soccer: 26.96 x 30.0 in</p>
            </div>
          </div>
        </div>

        {/* WHAT'S IN THE BOX */}
        <div className="product__accordion accordion border-b border-gray-200">
          <button
            type="button"
            onClick={() => setOpenAcc(openAcc === 'box' ? null : 'box')}
            className="flex w-full items-center justify-between py-[1.5rem] cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            <span className="summary__title flex flex-1 items-center">
              <svg className="icon icon-accordion" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, marginRight: '1.2rem' }}>
                <path d="M9.69502 0.6786C9.91338 0.601796 10.1516 0.603123 10.3691 0.682353L18.2151 3.54058C18.61 3.68445 18.8728 4.05988 18.8728 4.48018V14.4287C18.8728 14.8074 18.6588 15.1537 18.32 15.3231L10.4731 19.2465C10.196 19.385 9.87022 19.3873 9.59117 19.2526L1.45405 15.3244C1.10843 15.1576 0.888794 14.8076 0.888794 14.4239V4.48434C0.888794 4.05997 1.15665 3.68181 1.55699 3.541L9.69502 0.6786ZM6.07999 3.01017L2.5346 4.25719L10.149 7.63545L13.5692 6.118L6.07999 3.01017ZM6.78606 2.76183L14.1997 5.83828L17.5367 4.35774L10.0268 1.62195L6.78606 2.76183ZM1.88879 14.4239L1.88879 5.06467L9.64898 8.50762V18.1701L1.88879 14.4239ZM17.8728 14.4287L10.649 18.0405V8.50762L17.8728 5.30263V14.4287Z" fillRule="evenodd" />
              </svg>
              <span className="accordion__title uppercase" style={{ fontSize: '13px', letterSpacing: '0.3em' }}>What&apos;s In The Box?</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" className={`icon icon-caret w-[12px] h-[8px] transition-transform duration-300 ${openAcc === 'box' ? 'scale-y-[-1]' : ''}`} fill="none" viewBox="0 0 24 15">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z" fill="currentColor" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: openAcc === 'box' ? '8rem' : '0' }}
          >
            <div className="pb-6 text-[14px] text-gray-600 leading-relaxed">
              <ul className="list-disc pl-5 space-y-1">
                <li>Remote Control</li>
                <li>Easy To Assemble Mounting Kit</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SHIPPING DETAILS */}
        <div className="product__accordion accordion border-b border-gray-200">
          <button
            type="button"
            onClick={() => setOpenAcc(openAcc === 'ship' ? null : 'ship')}
            className="flex w-full items-center justify-between py-[1.5rem] cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            <span className="summary__title flex flex-1 items-center">
              <svg className="icon icon-accordion" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, marginRight: '1.2rem' }}>
                <path d="M16.4116 2.07871C16.3845 2.09721 16.3574 2.11565 16.3303 2.13411C16.1517 2.25559 15.9719 2.37791 15.7837 2.52296L15.7773 2.52789C14.8355 3.23007 13.6039 4.27066 12.2818 5.4955C12.1614 5.60703 11.994 5.65239 11.8338 5.61687L3.68598 3.81033C3.60396 3.80009 3.57101 3.79608 3.53891 3.79608C3.32198 3.79608 3.11893 3.92321 3.0302 4.12886C2.92673 4.39247 3.02138 4.67552 3.23628 4.81149L3.24111 4.81454L8.61434 8.30083C8.741 8.38301 8.82374 8.51802 8.83947 8.66819C8.8552 8.81836 8.80223 8.96759 8.69534 9.07423L8.66991 9.09961C7.38122 10.4798 6.31043 11.7361 5.58838 12.7137C5.47003 12.8747 5.36378 13.0195 5.27879 13.1514C5.16553 13.3272 4.95486 13.4139 4.75068 13.3689L2.19767 12.8052C2.11507 12.7948 2.08257 12.7908 2.05053 12.7908C1.83353 12.7908 1.6304 12.918 1.54169 13.1236C1.44423 13.3719 1.52255 13.6375 1.71155 13.7811L4.70992 14.8869C4.84334 14.9361 4.9495 15.0398 5.00183 15.172L6.23217 18.2805C6.33749 18.4229 6.50021 18.5 6.6743 18.5C6.68974 18.5 6.70318 18.4991 6.71409 18.4977C6.75433 18.4624 6.80008 18.4337 6.84965 18.4128C7.09772 18.3083 7.23368 18.0443 7.17792 17.7789L7.17755 17.7772L6.60833 15.2112C6.56292 15.0066 6.65004 14.7953 6.82652 14.6821C6.90797 14.6299 6.97089 14.584 7.04582 14.5293C7.10751 14.4844 7.17733 14.4334 7.27233 14.3682C8.25973 13.6492 9.5053 12.5837 10.8878 11.2987L10.9132 11.2733C11.0198 11.1669 11.1687 11.1143 11.3185 11.13C11.4683 11.1457 11.603 11.2281 11.6853 11.3542L15.1827 16.7203C15.2864 16.8837 15.4603 16.9728 15.6474 16.9728C15.7137 16.9728 15.7958 16.9563 15.866 16.9273C16.1134 16.8225 16.2489 16.5588 16.1933 16.294L14.3782 8.1444C14.3425 7.9844 14.3876 7.8171 14.4987 7.69663C15.7202 6.37288 16.7705 5.15757 17.4604 4.21249L17.4689 4.20111C17.614 4.01381 17.7363 3.83484 17.8578 3.65697C17.8763 3.6299 17.8948 3.60285 17.9133 3.5758C18.0978 3.29428 18.3328 2.929 18.4428 2.55475C18.5482 2.19592 18.5158 1.92451 18.2922 1.70148C18.1713 1.58082 17.9849 1.5 17.7692 1.5C17.4882 1.5 17.1061 1.62056 16.4116 2.07871ZM11.1716 12.3976C9.92929 13.5361 8.79171 14.4994 7.85517 15.1808L7.84395 15.1889C7.79752 15.2208 7.73884 15.2628 7.67606 15.308C7.66979 15.3125 7.66348 15.3171 7.65713 15.3216L8.15558 17.5686C8.30356 18.2625 7.96934 18.9767 7.32384 19.2951C7.10254 19.4742 6.82781 19.5 6.6743 19.5C6.16465 19.5 5.66279 19.2521 5.36533 18.7835C5.34846 18.7569 5.33414 18.7288 5.32255 18.6996L4.15425 15.7478L1.30743 14.6979C1.27444 14.6858 1.24282 14.6701 1.2131 14.6513C0.56351 14.2403 0.341328 13.4303 0.615189 12.7472L0.618547 12.7388C0.868584 12.1463 1.44556 11.7908 2.05053 11.7908C2.15024 11.7908 2.24946 11.8035 2.31873 11.8124C2.32791 11.8136 2.33656 11.8147 2.34462 11.8157C2.36005 11.8177 2.37537 11.8203 2.39055 11.8237L4.63775 12.3198C4.68444 12.255 4.73137 12.1912 4.77648 12.1298L4.78291 12.1211L4.78359 12.1202C5.46491 11.1976 6.42874 10.0567 7.57005 8.81531L2.69897 5.65488C2.05143 5.24337 1.8302 4.43467 2.1037 3.75248L2.10706 3.74411C2.35707 3.15168 2.93387 2.79608 3.53891 2.79608C3.63888 2.79608 3.73821 2.8088 3.80785 2.81773C3.81678 2.81887 3.82523 2.81996 3.83313 2.82094C3.8487 2.82288 3.86417 2.82556 3.87949 2.82895L11.795 4.58399C13.0596 3.4216 14.2446 2.42349 15.1764 1.72853C15.3888 1.56496 15.5937 1.42564 15.7706 1.30538C15.7981 1.28666 15.8249 1.26841 15.851 1.2506L15.8574 1.24625C16.5966 0.758201 17.1851 0.5 17.7692 0.5C18.2292 0.5 18.6761 0.671867 18.9985 0.99357C19.5773 1.57101 19.566 2.27912 19.4022 2.83663C19.2467 3.36596 18.9337 3.8433 18.7575 4.11215L18.7411 4.13711C18.7231 4.16341 18.7045 4.19042 18.6855 4.21819C18.5656 4.39374 18.4268 4.59704 18.2639 4.80777C17.5744 5.7516 16.563 6.92641 15.411 8.182L17.1709 16.0836C17.3254 16.8078 16.9545 17.5539 16.2531 17.8493L16.2509 17.8503C16.0679 17.9263 15.8552 17.9728 15.6474 17.9728C15.1387 17.9728 14.6379 17.7259 14.3402 17.2591L11.1716 12.3976Z" />
              </svg>
              <span className="accordion__title uppercase" style={{ fontSize: '13px', letterSpacing: '0.3em' }}>Shipping Details</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" className={`icon icon-caret w-[12px] h-[8px] transition-transform duration-300 ${openAcc === 'ship' ? 'scale-y-[-1]' : ''}`} fill="none" viewBox="0 0 24 15">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 15c-.3 0-.6-.1-.8-.4l-11-13C-.2 1.2-.1.5.3.2c.4-.4 1.1-.3 1.4.1L12 12.5 22.2.4c.4-.4 1-.5 1.4-.1.4.4.5 1 .1 1.4l-11 13c-.1.2-.4.3-.7.3z" fill="currentColor" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: openAcc === 'ship' ? '6rem' : '0' }}
          >
            <div className="pb-6 text-[14px] text-gray-600 leading-relaxed space-y-1">
              <p>Free Shipping (14-21 Days)</p>
              <p>Express Shipping (7-10 Days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── REFUND NOTE — exact live product__text ───── */}
      <p
        className="product__text mt-5 flex items-center gap-3 uppercase"
        style={{
          fontSize: '12px',
          letterSpacing: '0.06em',
          color: 'rgba(28,29,31,0.7)',
          fontFamily: 'Poppins, sans-serif',
          lineHeight: 1.5,
        }}
      >
        <svg className="icon icon-accordion flex-shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <path d="M11.571 1.05882C11.571 0.750194 11.8198 0.5 12.1266 0.5H13.4572C17.0692 0.5 20 3.45304 20 7.08924C20 10.7255 17.0692 13.6785 13.4572 13.6785L1.89992 13.7105L1.30855 13.1197L1.89992 12.5484L13.4572 12.5608C16.4541 12.5608 18.8889 10.1096 18.8889 7.08924C18.8889 4.06891 16.4541 1.61765 13.4572 1.61765H12.1266C11.8198 1.61765 11.571 1.36745 11.571 1.05882Z" />
          <path d="M6.00311 7.00677C6.22317 6.7917 6.57489 6.79679 6.78871 7.01815C7.00252 7.2395 6.99746 7.59329 6.7774 7.80836L6.00311 7.00677ZM1.30855 13.1197L6.73968 18.5463C6.9565 18.7647 6.95627 19.1185 6.73917 19.3366C6.52207 19.5547 6.17031 19.5544 5.9535 19.3361L0.162462 13.5034C0.0572388 13.3974 -0.00128425 13.2533 2.13868e-05 13.1036C0.00132703 12.9538 0.0623521 12.8108 0.169407 12.7067C0.3269 12.5535 1.78474 11.1291 3.20439 9.74186L6.00311 7.00677L6.7774 7.80836L3.97862 10.5435C2.95441 11.5444 1.8705 12.5709 1.30855 13.1197Z" />
        </svg>
        CUSTOM GLOW JERSEYS ARE NOT REFUNDABLE, RETURNABLE, OR REPLACEABLE. PLEASE MAKE SURE ALL DETAILS ARE CORRECT.
      </p>

    </div>
  );
};

export default ConfiguratorUI;