'use client';

import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, ContactShadows, Environment } from '@react-three/drei';
import { memo, Suspense, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as THREE from 'three';
import Model from '../Model/Model';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import SnapshotController from './SnapshotController';


const EXP_DEBUG = { panel: false };

const EXP_DEFAULTS = {
  camX: 0, camY: 0.05, camZ: 1.95, camFov: 32,
  ambientDark: 0.15, ambientLit: 0.55,
  dir1Dark: 0.35, dir1Lit: 1.2,
  dir2Dark: 0.2, dir2Lit: 0.5,
  envIntensity: 0.25,
  wrapX: 0, wrapY: 0.08, wrapZ: 0.08, wrapScale: 0.8,
  bloomThreshold: 1.05, bloomIntensity: 0.32, bloomLevels: 4, bloomRadius: 0.35,
  shadowY: -0.48, shadowOpacity: 0.22, shadowBlur: 1.8,
  exposure: 1.0,
};

type ExpTweakState = typeof EXP_DEFAULTS;
let expTweaks: ExpTweakState = { ...EXP_DEFAULTS };
const expListeners = new Set<(s: ExpTweakState) => void>();

function patchExpTweaks(partial: Partial<ExpTweakState>) {
  expTweaks = { ...expTweaks, ...partial };
  expListeners.forEach((fn) => fn(expTweaks));
}

function useExpTweaks(): ExpTweakState {
  const [s, set] = useState(expTweaks);
  useEffect(() => {
    expListeners.add(set);
    return () => { expListeners.delete(set); };
  }, []);
  return s;
}

function serializeExpDefaults(t: ExpTweakState): string {
  const kv = (k: keyof ExpTweakState) =>
    `${k}: ${typeof t[k] === 'number' ? parseFloat((t[k] as number).toFixed(6)) : JSON.stringify(t[k])}`;
  return `const EXP_DEFAULTS = {\n  ${Object.keys(EXP_DEFAULTS).map((k) => kv(k as keyof ExpTweakState)).join(',\n  ')}\n};`;
}

function ExperienceDebugPanel() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.getElementById('experience-debug-panel')?.remove();
    const host = document.createElement('div');
    host.id = 'experience-debug-panel';
    document.body.appendChild(host);
    const root: Root = createRoot(host);

    const slider = (
      label: string,
      key: keyof ExpTweakState,
      min: number,
      max: number,
      step: number,
      values: ExpTweakState,
    ) => (
      <label key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 58px', gap: 6, alignItems: 'center', fontSize: 11, marginBottom: 4, color: '#d8d8d8' }}>
        <span>
          {label}
          <input type="range" min={min} max={max} step={step} value={values[key] as number}
            onChange={(e) => patchExpTweaks({ [key]: parseFloat(e.target.value) })}
            style={{ width: '100%', display: 'block' }} />
        </span>
        <input type="number" step={step} value={Number(values[key])}
          onChange={(e) => patchExpTweaks({ [key]: parseFloat(e.target.value) })}
          style={{ width: 58, fontSize: 11, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 4, padding: '2px 4px' }} />
      </label>
    );

    const renderPanel = (values: ExpTweakState, openVal: boolean) => {
      root.render(
        <div style={{ position: 'fixed', top: 8, left: 296, zIndex: 99999, width: 260, maxHeight: '96vh', overflow: 'auto', background: 'rgba(12,12,14,0.92)', color: '#fff', border: '1px solid #333', borderRadius: 10, padding: 10, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>EXPERIENCE TWEAKS</span>
            <button type="button" onClick={() => setOpen((v) => !v)} style={{ background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>{openVal ? 'hide' : 'show'}</button>
          </div>
          {openVal && (
            <>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Camera</summary>
                {slider('cam X', 'camX', -2, 2, 0.01, values)}
                {slider('cam Y', 'camY', -1, 2, 0.01, values)}
                {slider('cam Z', 'camZ', 0.4, 6, 0.01, values)}
                {slider('fov', 'camFov', 18, 70, 0.5, values)}
                {slider('exposure', 'exposure', 0.2, 2.5, 0.01, values)}
              </details>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Lights</summary>
                {slider('ambient dark', 'ambientDark', 0, 2, 0.01, values)}
                {slider('ambient lit', 'ambientLit', 0, 2, 0.01, values)}
                {slider('dir1 dark', 'dir1Dark', 0, 3, 0.01, values)}
                {slider('dir1 lit', 'dir1Lit', 0, 3, 0.01, values)}
                {slider('dir2 dark', 'dir2Dark', 0, 3, 0.01, values)}
                {slider('dir2 lit', 'dir2Lit', 0, 3, 0.01, values)}
                {slider('env', 'envIntensity', 0, 2, 0.01, values)}
              </details>
              <details style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Wrap / bloom / shadow</summary>
                {slider('wrap X', 'wrapX', -1, 1, 0.001, values)}
                {slider('wrap Y', 'wrapY', -1, 1, 0.001, values)}
                {slider('wrap Z', 'wrapZ', -1, 1, 0.001, values)}
                {slider('wrap scale', 'wrapScale', 0.3, 2, 0.01, values)}
                {slider('bloom thresh', 'bloomThreshold', 0, 2, 0.01, values)}
                {slider('bloom int', 'bloomIntensity', 0, 2, 0.01, values)}
                {slider('bloom levels', 'bloomLevels', 1, 8, 1, values)}
                {slider('bloom radius', 'bloomRadius', 0, 1, 0.01, values)}
                {slider('shadow Y', 'shadowY', -1.5, 0.2, 0.01, values)}
                {slider('shadow opacity', 'shadowOpacity', 0, 1, 0.01, values)}
                {slider('shadow blur', 'shadowBlur', 0, 4, 0.05, values)}
              </details>
             <AnimatedCopyButton 
                label="COPY EXPERIENCE TWEAKS" 
                onCopy={() => serializeExpDefaults(expTweaks)} 
              />
            </>
          )}
        </div>,
      );
    };

    renderPanel(expTweaks, open);
    const unsub = (s: ExpTweakState) => renderPanel(s, open);
    expListeners.add(unsub);
    return () => { expListeners.delete(unsub); root.unmount(); host.remove(); };
  }, [open]);

  return null;
}

function AnimatedCopyButton({ label, onCopy }: { label: string; onCopy: () => string }) {
  const [isCopying, setIsCopying] = useState(false);

  return (
    <button
      type="button"
      disabled={isCopying}
      onClick={async () => {
        setIsCopying(true);
        try {
          const src = onCopy();
          console.log('[TWEAKS DEFAULTS]\n', src);
          await navigator.clipboard?.writeText(src);
          // 400ms delay so the loading animation is actually visible to the user
          await new Promise((r) => setTimeout(r, 400));
          alert('Tweaks successfully copied to clipboard!');
        } catch (err) {
          alert('Failed to copy tweaks.');
        } finally {
          setIsCopying(false);
        }
      }}
      style={{
        width: '100%',
        marginTop: 8,
        padding: '6px 8px',
        background: '#0b45ff',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        cursor: isCopying ? 'not-allowed' : 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        opacity: isCopying ? 0.8 : 1,
      }}
    >
      {isCopying && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
        </svg>
      )}
      {isCopying ? 'COPYING...' : label}
    </button>
  );
}


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
  const t = useExpTweaks();


  return (
    <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden bg-[#1a1a1a]">
    {EXP_DEBUG.panel && <ExperienceDebugPanel />}
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

<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
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
    dpr={[1, 1.75]}
    frameloop="always"
       camera={{
      position: [t.camX, t.camY, t.camZ],
      fov: t.camFov,
      near: 0.1,
      far: 20,
    }}
    gl={{
      antialias: true,
      alpha: false,
      toneMapping: THREE.NeutralToneMapping,
      toneMappingExposure: t.exposure,
      outputColorSpace: THREE.SRGBColorSpace,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      preserveDrawingBuffer: true,
    }}
  >
    <AdaptiveDpr />

    <ambientLight intensity={isDark ? t.ambientDark : t.ambientLit} />
    <directionalLight position={[3, 4, 5]} intensity={isDark ? t.dir1Dark : t.dir1Lit} />
    <directionalLight position={[-2, 2, 3]} intensity={isDark ? t.dir2Dark : t.dir2Lit} />
    <Environment preset="city" environmentIntensity={t.envIntensity} />

    <Suspense fallback={null}>
      <group position={[t.wrapX, t.wrapY, t.wrapZ]} scale={t.wrapScale}>
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
        position={[0, t.shadowY, 0]}
        opacity={t.shadowOpacity}
        scale={5}
        blur={t.shadowBlur}
        far={1.5}
        resolution={256}
        frames={1}
      />

      <EffectComposer multisampling={0} enableNormalPass={false}>
                <Bloom
          mipmapBlur
          luminanceThreshold={t.bloomThreshold}
          intensity={t.bloomIntensity}
          levels={t.bloomLevels}
          radius={t.bloomRadius}
        />
      </EffectComposer>
    </Suspense>
  </Canvas>
    </div>
  );
};

export default memo(Experience);