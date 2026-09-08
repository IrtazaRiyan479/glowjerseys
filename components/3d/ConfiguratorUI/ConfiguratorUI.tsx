'use client';

import React from 'react';

interface ConfiguratorUIProps {
  sizeOptionData: any[];
  sizeOptionValue: number | undefined;
  setSizeOptionValue: (v: number) => void;
  sportsTypeData: any[];
  sportsTypeValue: string | undefined;
  setSportsTypeValue: (v: string) => void;
  configurationData: any;

  selectedSport: string;
  setSelectedSport: (v: string) => void;

  // live 3D controls
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
  { name: 'Neutral White', hex: '#FBECCB' },
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
  { name: 'Neutral White', hex: '#FBECCB' },
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
}: ConfiguratorUIProps) => {
  const nameLen = name?.length ?? 0;
  const numberLen = number?.length ?? 0;

  // Live-site active styles (light theme overrides from #gjcz)
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
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  }}
>
      {/* Title + Price */}
      <h1
        className="font-bold tracking-tight leading-none"
        style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}
      >
        CUSTOM GLOW JERSEY
      </h1>

      <p
        className="mt-2 font-semibold tracking-tight"
        style={{ fontSize: '1.65rem', letterSpacing: '-0.02em' }}
      >
        $164
        <span style={{ fontSize: '0.95rem', verticalAlign: 'super' }}>.99</span>
      </p>

      <p className="mt-1 text-sm text-gray-500">Shipping calculated at checkout.</p>

      <p className="mt-1 text-sm text-gray-600">
        4 interest-free installments, or from $14.89/mo with{' '}
        <span className="underline cursor-pointer">shop</span>
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
          {(sizeOptionData?.length
            ? sizeOptionData
            : [
                { value: 20, unit: 'inch' },
                { value: 30, unit: 'inch' },
              ]
          ).map((option: any) => {
            const isActive = sizeOptionValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSizeOptionValue(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border ${
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
<div className="flex gap-2 mb-5">
  <button
    type="button"
    onClick={() => setIsDark(!isDark)}
    className="flex-1 py-2.5 rounded-[9px] text-[12.5px] font-semibold border border-[#c7ccd1] bg-white text-gray-800 hover:border-gray-400 transition-all"
  >
    {isDark ? 'Switch to Day' : 'Switch to Night'}
  </button>

  <button
    type="button"
    onClick={() => setNeonOn(!neonOn)}
    className={`flex-1 py-2.5 rounded-[9px] text-[12.5px] font-semibold border transition-all ${
      neonOn
        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
        : 'border-[#c7ccd1] bg-white text-gray-800 hover:border-gray-400'
    }`}
  >
    {neonOn ? 'Neon: ON' : 'Neon: OFF'}
  </button>
</div>
    </div>
  );
};

export default ConfiguratorUI;