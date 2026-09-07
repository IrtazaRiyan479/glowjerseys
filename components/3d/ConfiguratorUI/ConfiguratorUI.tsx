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
}

const neonColors = [
  { name: 'Green', hex: '#00ff66' },
  { name: 'Cyan', hex: '#00e5ff' },
  { name: 'Blue', hex: '#0066ff' },
  { name: 'Purple', hex: '#b300ff' },
  { name: 'Pink', hex: '#ff00aa' },
  { name: 'Red', hex: '#ff0033' },
  { name: 'Orange', hex: '#ff6600' },
  { name: 'Yellow', hex: '#ffee00' },
  { name: 'White', hex: '#ffffff' },
];

const ConfiguratorUI = ({
  sizeOptionData,
  sizeOptionValue,
  setSizeOptionValue,
  sportsTypeData,
  sportsTypeValue,
  setSportsTypeValue,
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
}: ConfiguratorUIProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">CUSTOM GLOW JERSEY</h1>
      <p className="text-xl font-semibold mt-1">$299.99</p>
      <p className="text-sm text-gray-500">Shipping calculated at checkout.</p>

      {/* SIZE */}
      <p className="mt-6 font-medium">SIZE</p>
      <div className="flex gap-2 mt-2">
        {sizeOptionData.map((option) => (
          <button
            key={option.value}
            onClick={() => setSizeOptionValue(option.value)}
            className={`px-4 py-2 rounded ${
              sizeOptionValue === option.value
                ? 'bg-black text-white'
                : 'border border-gray-300'
            }`}
          >
            {option.value} {option.unit}
          </button>
        ))}
      </div>

      {/* SPORT */}
      <p className="mt-6 font-medium">SPORT</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {sportsTypeData.map((option) => (
          <button
            key={option.name}
            onClick={() => setSportsTypeValue(option.name)}
            className={`px-4 py-2 rounded ${
              sportsTypeValue === option.name
                ? 'bg-black text-white'
                : 'border border-gray-300'
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>

      {/* NAME & NUMBER */}
      <p className="mt-6 font-medium">Name & Number</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
        maxLength={13}
        placeholder="NAME"
        className="w-full border p-2 mt-2 rounded"
      />
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 2))}
        maxLength={2}
        placeholder="NUMBER"
        className="w-full border p-2 mt-2 rounded"
      />

      {/* OUTLINE / JERSEY COLOR */}
      <p className="mt-6 font-medium">Jersey / Outline Color</p>
      <div className="flex flex-wrap gap-3 mt-2">
        {neonColors.map((c) => (
          <button
            key={c.hex}
            onClick={() => setOutlineColor(c.hex)}
            className={`w-9 h-9 rounded-full border-2 ${
              outlineColor === c.hex ? 'border-black scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
      </div>

      {/* NAME COLOR */}
      <p className="mt-6 font-medium">Name Color</p>
      <div className="flex flex-wrap gap-3 mt-2">
        {neonColors.map((c) => (
          <button
            key={c.hex}
            onClick={() => setNameColor(c.hex)}
            className={`w-9 h-9 rounded-full border-2 ${
              nameColor === c.hex ? 'border-black scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      {/* NUMBER COLOR */}
      <p className="mt-6 font-medium">Number Color</p>
      <div className="flex flex-wrap gap-3 mt-2">
        {neonColors.map((c) => (
          <button
            key={c.hex}
            onClick={() => setNumberColor(c.hex)}
            className={`w-9 h-9 rounded-full border-2 ${
              numberColor === c.hex ? 'border-black scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

    {/* BACKBOARD */}
<p className="mt-6 font-medium">Backboard</p>
<div className="flex flex-wrap gap-3 mt-2">
  {/* Transparent */}
  <button
    onClick={() => setBackboardColor('transparent')}
    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
      backboardColor === 'transparent' ? 'border-black scale-110' : 'border-gray-300'
    }`}
    style={{
      background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 10px 10px',
    }}
    title="Transparent"
  >
    T
  </button>

  {/* Black */}
  <button
    onClick={() => setBackboardColor('black')}
    className={`w-9 h-9 rounded-full border-2 ${
      backboardColor === 'black' ? 'border-black scale-110' : 'border-gray-300'
    }`}
    style={{ backgroundColor: '#111' }}
    title="Black"
  />

  {/* Colored backboards */}
  {neonColors.map((c) => (
    <button
      key={c.hex + '-board'}
      onClick={() => setBackboardColor(c.hex)}
      className={`w-9 h-9 rounded-full border-2 ${
        backboardColor === c.hex ? 'border-black scale-110' : 'border-gray-300'
      }`}
      style={{ backgroundColor: c.hex }}
      title={c.name}
    />
  ))}
</div>
    </div>
  );
};

export default ConfiguratorUI;