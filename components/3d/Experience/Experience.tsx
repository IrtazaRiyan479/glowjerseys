'use client';

import { Canvas} from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { Suspense, useState} from 'react';
import * as THREE from 'three';
import Model from '../Model/Model';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import SnapshotController from './SnapshotController';

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
  onSnapshotReady?: (fn: () => Promise<string | null>) => void;
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
  onSnapshotReady,
}: ExperienceProps) => {
  const [textureVariant, setTextureVariant] = useState<1 | 2>(1);


  return (
    <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden bg-[#1a1a1a]">

<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
  <button
    type="button"
    onClick={() => setTextureVariant(1)}
    className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg transition ${
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
    className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg transition ${
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

<button
  type="button"
  className="absolute bottom-6 right-4 z-50 px-3 py-2 rounded-md bg-white/90 text-black text-xs font-semibold shadow"
  onClick={async () => {
    const fn = (window as any).__takeJerseySnapshot;
    if (!fn) return alert('Snapshot not ready');
    const dataUrl = await fn();
    if (!dataUrl) return alert('Snapshot failed');
    const w = window.open('');
    if (w) {
      w.document.write(`<img src="${dataUrl}" style="max-width:100%" />`);
    }
  }}
>
  Test Snapshot
</button>

  <Canvas
  shadows={false}
  dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 3) : 1}
  camera={{
    position: [0, 0.05, 1.95],
    fov: 32,
    near: 0.1,
    far: 40,
  }}
  gl={{
    antialias: true,
    alpha: false,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.05,
    outputColorSpace: THREE.SRGBColorSpace,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
    preserveDrawingBuffer: true,
  }}
>
       {isDark ? (
          <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[3, 4, 5]} intensity={0.35} />
            <directionalLight position={[-2, 2, 3]} intensity={0.2} />
            <Environment preset="city" environmentIntensity={0.25} />
          </>
        ) : (
          <>
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 5, 6]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 2, 4]} intensity={0.5} />
            <Environment preset="city" environmentIntensity={0.25} />
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
            {onSnapshotReady && <SnapshotController onReady={onSnapshotReady} />}
          </group>

          <ContactShadows
            position={[0, -0.48, 0]}
            opacity={0.25}
            scale={5}
            blur={2.5}
            far={1.5}
          />

          

       <EffectComposer multisampling={4}>
  <Bloom
    kernelSize={KernelSize.VERY_SMALL}
    luminanceThreshold={1.05}
    intensity={0.18}
    levels={2}
    // mipmapBlur
  />
</EffectComposer>
          
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;