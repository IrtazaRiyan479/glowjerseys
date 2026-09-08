'use client';

import Experience from '@/components/3d/Experience/Experience'; // Adjust path if needed
import ConfiguratorUI from '@/components/3d/ConfiguratorUI/ConfiguratorUI'; // Adjust path if needed
import React, { useState } from 'react';

// Dummy data for the UI dropdowns/buttons
const sizeOptionData = [{ value: 16, unit: 'in' }, { value: 20, unit: 'in' }, { value: 24, unit: 'in' }];
const sportsTypeData = [{ name: 'Soccer' }, { name: 'Basketball' }, { name: 'Baseball' }];

const Page = () => {
  // Master state for the 3D model
  const [sizeOptionValue, setSizeOptionValue] = useState(20);
  const [sportsTypeValue, setSportsTypeValue] = useState('Soccer');
  const [name, setName] = useState('BROWN');
  const [number, setNumber] = useState('7');
  const [outlineColor, setOutlineColor] = useState('#ff3300');
  const [nameColor, setNameColor] = useState('#ffffff');
  const [numberColor, setNumberColor] = useState('#ffffff');
  const [backboardColor, setBackboardColor] = useState('transparent');

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#1a1a1a]">
      
      {/* LEFT SIDE: 3D Experience (Takes up 2/3 of the screen) */}
      <div className="relative h-full w-2/3">
        <Experience 
          name={name}
          number={number}
          outlineColor={outlineColor}
          nameColor={nameColor}
          numberColor={numberColor}
          backboardColor={backboardColor}
        />
      </div>

      {/* RIGHT SIDE: Configurator UI (Takes up 1/3 of the screen) */}
      <div className="h-full w-1/3 overflow-y-auto bg-white text-black shadow-[-10px_0_20px_rgba(0,0,0,0.2)] z-10">
        <ConfiguratorUI 
          sizeOptionData={sizeOptionData}
          sizeOptionValue={sizeOptionValue}
          setSizeOptionValue={setSizeOptionValue}
          sportsTypeData={sportsTypeData}
          sportsTypeValue={sportsTypeValue}
          setSportsTypeValue={setSportsTypeValue}
          configurationData={null}
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
        />
      </div>

    </div>
  );
};

export default Page;