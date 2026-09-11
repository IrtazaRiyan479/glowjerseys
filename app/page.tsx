'use client';

import Experience from '@/components/3d/Experience/Experience';
import ConfiguratorUI from '@/components/3d/ConfiguratorUI/ConfiguratorUI';
import React, { useCallback, useRef, useState } from 'react';
import { uploadImage } from '@/actions/cloudinary/uploadImage';
import { useCartStore } from '@/store/cartStore';
import type { JerseySelectedOptions } from '@/data';

const sizeOptionData = [{ value: 16, unit: 'in' }, { value: 20, unit: 'in' }, { value: 24, unit: 'in' }];
const sportsTypeData = [{ name: 'Soccer' }, { name: 'Basketball' }, { name: 'Baseball' }];

const SPORT_MODELS: Record<string, string> = {
  Baseball: '/3d/models/BaseBall.glb',
  Basketball: '/3d/models/Basketball.glb',
  Football: '/3d/models/Football.glb',
  Soccer: '/3d/models/BlueSoccer.glb',
  Hockey: '/3d/models/Hockey.glb',
};

const Page = () => {
  const [sizeOptionValue, setSizeOptionValue] = useState(20);
  const [sportsTypeValue, setSportsTypeValue] = useState('Soccer');
  const [name, setName] = useState('BROWN');
  const [number, setNumber] = useState('7');
  const [outlineColor, setOutlineColor] = useState('#ff3300');
  const [nameColor, setNameColor] = useState('#ffffff');
  const [numberColor, setNumberColor] = useState('#ffffff');
  const [backboardColor, setBackboardColor] = useState('transparent');
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [isDark, setIsDark] = useState(false);
  const [neonOn, setNeonOn] = useState(true);
  const [quantity, setQuantity] = useState(1);


const addItem = useCartStore((s) => s.addItem);
const snapshotRef = useRef<(() => Promise<string | null>) | null>(null);
const [addingToCart, setAddingToCart] = useState(false);

const onSnapshotReady = useCallback((fn: () => Promise<string | null>) => {
  snapshotRef.current = fn;
}, []);

const handleAddToCart = async () => {
  if (addingToCart) return;
  setAddingToCart(true);
  try {
    let previewImageUrl: string | undefined;

    const dataUrl = await snapshotRef.current?.();
    if (dataUrl) {
      try {
        previewImageUrl = await uploadImage(dataUrl);
      } catch {
        previewImageUrl = dataUrl;
      }
    }

    const selectedOptions: JerseySelectedOptions = {
      size: sizeOptionValue ?? 20,
      sport: selectedSport,
      name,
      number,
      jerseyColor: outlineColor,
      nameColor,
      numberColor,
      backboardColor,
      previewImageUrl,
    };

    addItem(selectedOptions, quantity);
  } finally {
    setAddingToCart(false);
  }
};

const currentGlbUrl = SPORT_MODELS[selectedSport] || '/3d/models/BlueSoccer.glb';


  return (
  <div className="grid h-full min-h-0 w-full grid-cols-1 grid-rows-[minmax(0,40svh)_minmax(0,1fr)] bg-[#1a1a1a] lg:grid-cols-[minmax(0,1fr)_min(480px,38%)] lg:grid-rows-1">
    <div className="relative min-h-0 min-w-0 overflow-hidden h-full">
      <Experience
        glbUrl={currentGlbUrl}
        name={name}
        number={number}
        outlineColor={outlineColor}
        nameColor={nameColor}
        numberColor={numberColor}
        backboardColor={backboardColor}
        isDark={isDark}
        neonOn={neonOn}
        setNeonOn={setNeonOn}
        onSnapshotReady={onSnapshotReady}
      />
    </div>

    <div className="z-10 flex min-h-0 min-w-0 w-full flex-col overflow-y-auto overflow-x-hidden bg-white text-black shadow-[-10px_0_20px_rgba(0,0,0,0.12)]">
      <div className="p-4 pb-8 md:p-5">
        <ConfiguratorUI
          sizeOptionData={sizeOptionData}
          sizeOptionValue={sizeOptionValue}
          setSizeOptionValue={setSizeOptionValue}
          sportsTypeData={sportsTypeData}
          sportsTypeValue={sportsTypeValue}
          setSportsTypeValue={setSportsTypeValue}
          configurationData={null}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          name={name}
          setName={setName}
          number={number}
          setNumber={setNumber}
          outlineColor={outlineColor}
          setOutlineColor={setOutlineColor}
          nameColor={nameColor}
          setNameColor={setNameColor}
          numberColor={numberColor}
          setNumberColor={setNumberColor}
          backboardColor={backboardColor}
          setBackboardColor={setBackboardColor}
          isDark={isDark}
          setIsDark={setIsDark}
          neonOn={neonOn}
          setNeonOn={setNeonOn}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
        />
      </div>
    </div>
  </div>
);
};

export default Page;