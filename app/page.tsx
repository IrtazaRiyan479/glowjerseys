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
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [isDark, setIsDark] = useState(false);
  const [neonOn, setNeonOn] = useState(true);

  const SPORT_MODELS: Record<string, string> = {
  Baseball: '/3d/models/Baseball.glb',
  Basketball: '/3d/models/Basketball.glb',
  Football: '/3d/models/Football.glb',
  Soccer: '/3d/models/BlueSoccer.glb',
  Hockey: '/3d/models/Hockey.glb',
};

const currentGlbUrl = SPORT_MODELS[selectedSport] || '/3d/models/BlueSoccer.glb';

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#1a1a1a]">
      
    {/* LEFT SIDE: 3D — takes all remaining space */}
    <div className="relative h-full flex-1 min-w-0">
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
      />
    </div>

      {/* RIGHT SIDE: Configurator UI (Takes up 1/3 of the screen) */}
<div className="h-full w-[580px] shrink-0 overflow-y-auto bg-white text-black shadow-[-10px_0_20px_rgba(0,0,0,0.2)] z-10">
      <div className="p-5">
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
        />
      </div>
    </div>

    </div>
  );
};

export default Page;