'use client';

import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import {
  TextureLoader,
  RepeatWrapping,
  SRGBColorSpace,
  LinearSRGBColorSpace,
} from 'three';
import React, { Suspense, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import Model from '../Model/Model';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

interface ExperienceProps {
  glbUrl: string;
  name: string;
  number: string;
  outlineColor: string;
  nameColor: string;
  numberColor: string;
  backboardColor: string;
  isDark: boolean;
  neonOn: boolean;
  setNeonOn: (v: boolean) => void;
}

const Experience = ({
  glbUrl,
  name,
  number,
  outlineColor,
  nameColor,
  numberColor,
  backboardColor,
  isDark,
  neonOn,
  setNeonOn,
}: ExperienceProps) => {
  const [textureVariant, setTextureVariant] = useState<1 | 2>(1);


  return (
    <div className="relative h-full w-full bg-[#1a1a1a]">

 {/* Texture swatch — bottom of shirt */}
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
  <button
    type="button"
    onClick={() => setTextureVariant(1)}
    className={`w-18 h-18 rounded-full overflow-hidden border-2 shadow-lg transition ${
      textureVariant === 1 ? 'border-white scale-110' : 'border-white/40 opacity-80 hover:opacity-100'
    }`}
    title="Brick texture 1"
  >
    <img
      src="/textures/wall/BrickWall01.jpg"
      alt="Texture 1"
      className="w-full h-full object-cover"
    />
  </button>

  <button
    type="button"
    onClick={() => setTextureVariant(2)}
    className={`w-18 h-18 rounded-full overflow-hidden border-2 shadow-lg transition ${
      textureVariant === 2 ? 'border-white scale-110' : 'border-white/40 opacity-80 hover:opacity-100'
    }`}
    title="Brick texture 2"
  >
    <img
      src="/textures/wall/BrickWall02.jpg"
      alt="Texture 2"
      className="w-full h-full object-cover"
    />
  </button>
</div>

{/* Neon toggle — top right */}
<div className="absolute top-4 right-4 z-50 flex items-center gap-2">
  <span className="text-white text-xs font-medium drop-shadow">Neon</span>
  <button
    type="button"
    role="switch"
    aria-checked={neonOn}
    onClick={() => setNeonOn(!neonOn)}
    className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
      neonOn ? 'bg-[#34C759]' : 'bg-[#787880]'
    }`}
  >
    <span
      className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
        neonOn ? 'translate-x-[20px]' : 'translate-x-0'
      }`}
    />
  </button>
</div>

  <Canvas
  shadows={false}
  dpr={[1, 1.25]}
  frameloop="demand"          // only re-render when something changes
  camera={{
    position: [0, 0.05, 1.9],
    fov: 35,
    near: 0.1,
    far: 40,
  }}
  gl={{
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    outputColorSpace: THREE.SRGBColorSpace,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  }}
>
       {isDark ? (
          <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[3, 4, 5]} intensity={0.35} />
            <directionalLight position={[-2, 2, 3]} intensity={0.2} />
            
            {/* ADDED: Gives the glass subtle reflections in the dark */}
            <Environment preset="city" environmentIntensity={0.15} />
          </>
        ) : (
          <>
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 5, 6]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 2, 4]} intensity={0.5} />
            
            {/* ADDED: Gives the glass bright reflections in daylight */}
            <Environment preset="city" environmentIntensity={0.8} />
          </>
        )}

       <Suspense fallback={null}>
        <group position={[0, 0.08, 0.08]} scale={0.8}>
            <Model
              glbUrl={glbUrl}
              outlineColor={outlineColor}
              backboardColor={backboardColor}
              name={name}
              number={number}
              nameColor={nameColor}
              numberColor={numberColor}
              neonOn={neonOn}
              isDark={isDark} 
              textureVariant={textureVariant}
            />
          </group>

          <ContactShadows
            position={[0, -0.48, 0]}
            opacity={0.25}
            scale={5}
            blur={2.5}
            far={1.5}
          />

          

       <EffectComposer multisampling={0}>
  <Bloom
    kernelSize={KernelSize.MEDIUM}
    luminanceThreshold={0.75}
    intensity={0.25}
    mipmapBlur
  />
</EffectComposer>

          
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;