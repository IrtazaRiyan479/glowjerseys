'use client';

import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { PresentationControls, ContactShadows } from '@react-three/drei';
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

const Experience = () => {
  const [isDark, setIsDark] = useState(true);
  const [neonOn, setNeonOn] = useState(true);
  // 1. ADDED: New state for toggling textures
  const [textureVariant, setTextureVariant] = useState<1 | 2>(1); 

  const outlineColor = '#ff3300';

  return (
    <div className="relative h-full w-full bg-[#1a1a1a]">
      {/* Control panel */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => setIsDark((d) => !d)}
          className="px-4 py-2 bg-white text-black rounded font-medium shadow hover:bg-gray-100 transition"
        >
          {isDark ? 'Switch to Day' : 'Switch to Night'}
        </button>

        <button
          onClick={() => setNeonOn((n) => !n)}
          className={`px-4 py-2 rounded font-medium shadow transition ${
            neonOn
              ? 'bg-emerald-400 text-black hover:bg-emerald-300'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {neonOn ? 'Neon: ON' : 'Neon: OFF'}
        </button>

        {/* 2. ADDED: Texture toggle button */}
        <button
          onClick={() => setTextureVariant((v) => (v === 1 ? 2 : 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded font-medium shadow hover:bg-blue-400 transition"
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
          </>
        ) : (
          <>
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 5, 6]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 2, 4]} intensity={0.5} />
          </>
        )}

       <Suspense fallback={null}>
          <group position={[0, 0.08, 0.08]} scale={0.8}>
            <Model
              glbUrl="/3d/models/BlueSoccer.glb"
              outlineColor={outlineColor}
              backboardColor="transparent"
              name="BROWN"
              number="7"
              nameColor="#ffffff"
              numberColor="#ffffff"
              neonOn={neonOn}
              isDark={isDark} 
              textureVariant={textureVariant} // 3. ADDED: Pass prop to model
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
              intensity={0.5}
            />
            <Bloom
              kernelSize={KernelSize.HUGE}
              luminanceThreshold={0.7}
              intensity={0.3}
            />
          </EffectComposer>

          
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;