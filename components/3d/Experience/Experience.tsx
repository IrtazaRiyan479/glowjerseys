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
}: ExperienceProps) => {
  const [textureVariant, setTextureVariant] = useState<1 | 2>(1);


  return (
    <div className="relative h-full w-full bg-[#1a1a1a]">

      {/* Texture button — bottom of shirt */}
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
  <button
    onClick={() => setTextureVariant((v) => (v === 1 ? 2 : 1))}
    className="px-5 py-2.5 bg-white/90 backdrop-blur text-black rounded-full text-sm font-semibold shadow-lg hover:bg-white transition"
  >
    Switch Texture
  </button>
</div>

      <Canvas
        shadows
        camera={{
          position: [0, 0.05, 1.9],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
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

          

         <EffectComposer multisampling={2}>
            <Bloom
              kernelSize={KernelSize.SMALL}
              luminanceThreshold={0.9}
              intensity={0.1}
            />
            <Bloom
              kernelSize={KernelSize.HUGE}
              luminanceThreshold={0.7}
              intensity={0.2}
            />
          </EffectComposer>

          
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;