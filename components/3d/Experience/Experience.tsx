'use client';

import { Canvas, useLoader, useThree } from '@react-three/fiber';
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

function Wall({ isDark }: { isDark: boolean }) {
  const dayMaps = useLoader(TextureLoader, [
    '/textures/wall/wall-night-color.jpeg',
    '/textures/wall/wall-night_normal.png',
    '/textures/wall/wall-night-roughness.jpg',
    '/textures/wall/wall-night_ambient.png',
  ]);

  const nightMaps = useLoader(TextureLoader, [
    '/textures/wall/wall-day-color.jpeg',
    '/textures/wall/wall-day_normal.png',
    '/textures/wall/wall-day-roughness.jpg',
    '/textures/wall/wall-day_ambient.png',
  ]);

  const [colorMap, normalMap, roughnessMap, aoMap] = isDark ? nightMaps : dayMaps;

  [colorMap, normalMap, roughnessMap, aoMap].forEach((tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    // Higher number = smaller bricks (less zoomed in)
    tex.repeat.set(12.5, 9.2);
    tex.anisotropy = 8;
  });

  colorMap.colorSpace = SRGBColorSpace;
  normalMap.colorSpace = LinearSRGBColorSpace;
  roughnessMap.colorSpace = LinearSRGBColorSpace;
  aoMap.colorSpace = LinearSRGBColorSpace;

  return (
    <mesh position={[0, 0, -0.55]} receiveShadow>
      <planeGeometry args={[14, 9]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        roughnessMap={roughnessMap}
        roughness={0.9}
        aoMap={aoMap}
        aoMapIntensity={0.8}
        metalness={0}
        color="#ffffff"
      />
    </mesh>
  );
}

/** Mouse-wheel zoom that scales only the shirt (wall stays fixed) */
function WheelZoom({
  scale,
  setScale,
  min = 0.7,
  max = 1.8,
}: {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  min?: number;
  max?: number;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setScale((s) => {
        const next = +(s + delta).toFixed(2);
        return Math.min(max, Math.max(min, next));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [gl, setScale, min, max]);

  return null;
}

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 1.8;

const Experience = () => {
  const [isDark, setIsDark] = useState(false);
  const [neonOn, setNeonOn] = useState(true);
  const [shirtScale, setShirtScale] = useState(1);

  const outlineColor = '#00ff66';

  const resetView = useCallback(() => {
    setShirtScale(1);
  }, []);

  return (
    <div className="relative h-full w-full bg-[#1a1a1a]">
      {/* Control panel – top-left */}
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
      </div>

      {/* Only reset remains – zoom is mouse wheel */}
      <div className="absolute bottom-6 right-4 z-50">
        <button
          onClick={resetView}
          className="px-3 py-1.5 text-sm bg-white/90 text-black rounded shadow hover:bg-white transition"
          title="Reset zoom"
        >
          Reset view
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
        }}
      >
        {isDark ? (
  <>
    <ambientLight intensity={0.22} />
    <directionalLight position={[3, 4, 5]} intensity={1.0} />
    <directionalLight position={[-2, 2, 3]} intensity={0.45} />
  </>
) : (
  <>
    <ambientLight intensity={0.65} />
    <directionalLight position={[4, 5, 6]} intensity={1.6} castShadow />
    <directionalLight position={[-3, 2, 4]} intensity={0.6} />
  </>
)}
        <Suspense fallback={null}>
          <WheelZoom scale={shirtScale} setScale={setShirtScale} min={MIN_ZOOM} max={MAX_ZOOM} />

          {/* Wall far enough back that rotation never clips */}
          <Wall isDark={isDark} />

          {/* Shirt group: lifted slightly, pushed forward, limited tilt */}
          <PresentationControls
            global={false}
            cursor={true}
            snap={false}
            speed={1.8}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3.2, Math.PI / 3.2]}
            azimuth={[-Math.PI, Math.PI]}
          >
          <group
              position={[0, 0.08, 0.08]}
              scale={shirtScale}
            >
                <Model
                  glbUrl="/3d/models/glowjerseys.glb"
                  outlineColor={outlineColor}
                  backboardColor="transparent"
                  name="BROWN"
                  number="7"
                  nameColor="#ffffff"
                  numberColor="#ffffff"
                  neonOn={neonOn}
                />
            </group>
          </PresentationControls>

          <ContactShadows
            position={[0, -0.48, 0]}
            opacity={0.3}
            scale={5}
            blur={2.5}
            far={1.5}
          />

         <EffectComposer enableNormalPass={false}>
            {/* 1. Tight Core Glow */}
            <Bloom 
              luminanceThreshold={1.0} 
              mipmapBlur 
              intensity={0.5}
            />
            {/* 2. Wide Atmospheric Dispersion */}
            <Bloom 
              luminanceThreshold={1.0} 
              mipmapBlur 
              intensity={0.6}
              levels={8} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;