'use client';

import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as THREE from 'three';
import NeonText from './NeonText';
import { SPORT_MODELS } from '@/data';
import { publicAssetUrl } from '@/lib/publicAssetUrl';

const MODEL_DEBUG = { panel: false };

const MODEL_DEFAULTS = {
  groupX: 0,
  groupY: -0.05,
  groupZ: 0,
  groupScale: 1.15,
  nameX: 0,
  nameY: 0.09,
  nameZ: 0.02,
  numX: 0,
  numY: -0.13,
  numZ: 0.02,
  wallRepeatX: 3,
  wallRepeatY: 2,
  wallNormal1: 0.12,
  wallNormal2: 0.65,
  wallRough1: 0.85,
  wallRough2: 0.65,
  wallMetal1: 0.05,
  wallMetal2: 0.08,
  neonIntensitySoft: 1.15,
  neonIntensityHard: 2.4,
  neonOffEmissive: 0.35,
  fresnelPow: 6,
  rimBoost: 4,
  neonFlatten: 0.62,
  glassOpacity: 0.305,
  glassRough: 0.35,
  acrylicOpacity: 0.095,
  acrylicRough: 0.17,
  solidRough: 0.045,
  solidClearcoatRough: 0.03,
  solidEnv: 3.2,
  solidEmissive: 0.22,
  coverRough: 0.02,
  coverEnv: 4.5,
  coverIor: 1.5,
  bounceTopY: 0.12,
  bounceBotY: -0.08,
  bounceZ: -0.05,
  bounceNameY: -0.215,
  bounceNumberY: 0.266,
  bounceTextZ: -0.183,
  w1OutlineGlow: 1,
  w1OutlineReach: 0.65,
  w1NameGlow: 0.08,
  w1NameReach: 0.28,
  w1NumberGlow: 0.04,
  w1NumberReach: 0.26,
  w1Multiply: 1.8,
  w1Falloff: 2,
  w2OutlineGlow: 0.85,
  w2OutlineReach: 0.83,
  w2NameGlow: 0.16,
  w2NameReach: 0.21,
  w2NumberGlow: 0.1,
  w2NumberReach: 0.57,
  w2Multiply: 4.9,
  w2Falloff: 1
};

type ModelTweakState = typeof MODEL_DEFAULTS;
let modelTweaks: ModelTweakState = { ...MODEL_DEFAULTS };
const modelListeners = new Set<(s: ModelTweakState) => void>();

function patchModelTweaks(partial: Partial<ModelTweakState>) {
  modelTweaks = { ...modelTweaks, ...partial };
  modelListeners.forEach((fn) => fn(modelTweaks));
}

function useModelTweaks(): ModelTweakState {
  const [s, set] = useState(modelTweaks);
  useEffect(() => {
    modelListeners.add(set);
    return () => { modelListeners.delete(set); };
  }, []);
  return s;
}

function serializeModelDefaults(t: ModelTweakState): string {
  const kv = (k: keyof ModelTweakState) =>
    `${k}: ${typeof t[k] === 'number' ? parseFloat((t[k] as number).toFixed(6)) : JSON.stringify(t[k])}`;
  return `const MODEL_DEFAULTS = {\n  ${Object.keys(MODEL_DEFAULTS).map((k) => kv(k as keyof ModelTweakState)).join(',\n  ')}\n};`;
}

const SOFT_OUTLINE = [
  '#FFE800', '#FBECCB', '#E8C07A', '#ffffff', '#ffff00', '#fff700',
  '#ffee00', '#f5e6a3', '#f0e68c', '#fffacd', '#fff8dc',
];

function ModelDebugPanel() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.getElementById('model-debug-panel')?.remove();
    const host = document.createElement('div');
    host.id = 'model-debug-panel';
    document.body.appendChild(host);
    const root: Root = createRoot(host);

    const slider = (
      label: string,
      key: keyof ModelTweakState,
      min: number,
      max: number,
      step: number,
      values: ModelTweakState,
    ) => (
      <label key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 58px', gap: 6, alignItems: 'center', fontSize: 11, marginBottom: 4, color: '#d8d8d8' }}>
        <span>
          {label}
          <input type="range" min={min} max={max} step={step} value={values[key] as number}
            onChange={(e) => patchModelTweaks({ [key]: parseFloat(e.target.value) })}
            style={{ width: '100%', display: 'block' }} />
        </span>
        <input type="number" step={step} value={Number(values[key])}
          onChange={(e) => patchModelTweaks({ [key]: parseFloat(e.target.value) })}
          style={{ width: 58, fontSize: 11, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 4, padding: '2px 4px' }} />
      </label>
    );

    const renderPanel = (values: ModelTweakState, openVal: boolean) => {
      root.render(
        <div style={{ position: 'fixed', top: 48, right: 8, zIndex: 99999, width: 260, maxHeight: '92vh', overflow: 'auto', background: 'rgba(12,12,14,0.92)', color: '#fff', border: '1px solid #333', borderRadius: 10, padding: 10, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>MODEL TWEAKS</span>
            <button type="button" onClick={() => setOpen((v) => !v)} style={{ background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>{openVal ? 'hide' : 'show'}</button>
          </div>
          {openVal && (
            <>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Group</summary>
                {slider('group X', 'groupX', -1, 1, 0.001, values)}
                {slider('group Y', 'groupY', -1, 1, 0.001, values)}
                {slider('group Z', 'groupZ', -1, 1, 0.001, values)}
                {slider('group scale', 'groupScale', 0.4, 2.5, 0.01, values)}
              </details>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Name / Number origin</summary>
                {slider('name X', 'nameX', -0.5, 0.5, 0.001, values)}
                {slider('name Y', 'nameY', -0.5, 0.5, 0.001, values)}
                {slider('name Z', 'nameZ', -0.2, 0.2, 0.001, values)}
                {slider('number X', 'numX', -0.5, 0.5, 0.001, values)}
                {slider('number Y', 'numY', -0.5, 0.5, 0.001, values)}
                {slider('number Z', 'numZ', -0.2, 0.2, 0.001, values)}
              </details>
              <details style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Wall</summary>
                {slider('repeat X', 'wallRepeatX', 1, 8, 0.1, values)}
                {slider('repeat Y', 'wallRepeatY', 1, 8, 0.1, values)}
                {slider('normal tex1', 'wallNormal1', 0, 1, 0.01, values)}
                {slider('normal tex2', 'wallNormal2', 0, 1, 0.01, values)}
                {slider('rough tex1', 'wallRough1', 0, 1, 0.01, values)}
                {slider('rough tex2', 'wallRough2', 0, 1, 0.01, values)}
                {slider('metal tex1', 'wallMetal1', 0, 1, 0.01, values)}
                {slider('metal tex2', 'wallMetal2', 0, 1, 0.01, values)}
              </details>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Neon / glass</summary>
                {slider('neon soft', 'neonIntensitySoft', 0, 6, 0.05, values)}
                {slider('neon hard', 'neonIntensityHard', 0, 8, 0.05, values)}
                {slider('off emissive', 'neonOffEmissive', 0, 2, 0.01, values)}
                {slider('glass opacity', 'glassOpacity', 0, 0.4, 0.005, values)}
                {slider('glass rough', 'glassRough', 0, 1, 0.01, values)}
                {slider('acrylic opacity', 'acrylicOpacity', 0, 0.5, 0.005, values)}
                {slider('acrylic rough', 'acrylicRough', 0, 1, 0.01, values)}
                {slider('solid rough', 'solidRough', 0, 0.4, 0.005, values)}
                {slider('solid coat rough', 'solidClearcoatRough', 0, 0.3, 0.005, values)}
                {slider('solid env', 'solidEnv', 0, 8, 0.05, values)}
                {slider('solid emissive', 'solidEmissive', 0, 1, 0.01, values)}
                {slider('cover rough', 'coverRough', 0, 0.3, 0.005, values)}
                {slider('cover env', 'coverEnv', 0, 10, 0.05, values)}
                {slider('cover ior', 'coverIor', 1.2, 2.3, 0.01, values)}
                {slider('fresnel pow', 'fresnelPow', 0.4, 6, 0.05, values)}
                {slider('rim boost', 'rimBoost', 0, 4, 0.05, values)}
                {slider('tube flatten', 'neonFlatten', 0, 1, 0.01, values)}
              </details>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Light positions</summary>
                {slider('Outline top Y', 'bounceTopY', -0.4, 0.4, 0.001, values)}
                {slider('Outline bottom Y', 'bounceBotY', -0.4, 0.4, 0.001, values)}
                {slider('Outline Z', 'bounceZ', -0.3, 0.1, 0.001, values)}
                {slider('Name light Y', 'bounceNameY', -0.4, 0.4, 0.001, values)}
                {slider('Number light Y', 'bounceNumberY', -0.4, 0.4, 0.001, values)}
                {slider('Name/Number Z', 'bounceTextZ', -0.3, 0.1, 0.001, values)}
              </details>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Brick 1 bounce</summary>
                {slider('Outline glow', 'w1OutlineGlow', 0, 6, 0.05, values)}
                {slider('Outline reach', 'w1OutlineReach', 0.05, 3, 0.01, values)}
                {slider('Name glow', 'w1NameGlow', 0, 2, 0.01, values)}
                {slider('Name reach', 'w1NameReach', 0.05, 2, 0.01, values)}
                {slider('Number glow', 'w1NumberGlow', 0, 2, 0.01, values)}
                {slider('Number reach', 'w1NumberReach', 0.05, 2, 0.01, values)}
                {slider('Wall multiply', 'w1Multiply', 0, 10, 0.1, values)}
                {slider('Light falloff', 'w1Falloff', 0.5, 3, 0.1, values)}
              </details>
              <details open style={{ marginBottom: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#9ad' }}>Brick 2 bounce</summary>
                {slider('Outline glow', 'w2OutlineGlow', 0, 6, 0.05, values)}
                {slider('Outline reach', 'w2OutlineReach', 0.05, 3, 0.01, values)}
                {slider('Name glow', 'w2NameGlow', 0, 2, 0.01, values)}
                {slider('Name reach', 'w2NameReach', 0.05, 2, 0.01, values)}
                {slider('Number glow', 'w2NumberGlow', 0, 2, 0.01, values)}
                {slider('Number reach', 'w2NumberReach', 0.05, 2, 0.01, values)}
                {slider('Wall multiply', 'w2Multiply', 0, 10, 0.1, values)}
                {slider('Light falloff', 'w2Falloff', 0.5, 3, 0.1, values)}
              </details>
            <AnimatedCopyButton 
            label="COPY MODEL TWEAKS" 
            onCopy={() => serializeModelDefaults(modelTweaks)} 
          />
            </>
          )}
        </div>,
      );
    };

    renderPanel(modelTweaks, open);
    const unsub = (s: ModelTweakState) => renderPanel(s, open);
    modelListeners.add(unsub);
    return () => { modelListeners.delete(unsub); root.unmount(); host.remove(); };
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
interface ModelProps {
  glbUrl: string;
  outlineColor?: string;
  backboardColor?: string;
  name?: string;
  number?: string;
  nameColor?: string;
  numberColor?: string;
  neonOn?: boolean;
  isDark?: boolean;
  textureVariant?: 1 | 2; 
}

const Model = ({
  glbUrl,
  outlineColor = '#FF8A00',
  backboardColor = 'transparent',
  name = '',
  number = '',
  nameColor = '#ffffff',
  numberColor = '#ffffff',
  neonOn = true,
  isDark = true,
  textureVariant = 2,
}: ModelProps) => {
  const t = useModelTweaks();
 const { scene } = useGLTF(glbUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene, glbUrl]);

  useEffect(() => {
  return () => {
    clonedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.geometry?.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => m?.dispose?.());
    });
  };
}, [clonedScene]);

  
  const [c1, n1, c2, n2] = useLoader(THREE.TextureLoader, [
    publicAssetUrl('/textures/wall/BrickWall01.jpg'),
    publicAssetUrl('/textures/wall/BrickWall01_Normal.jpg'),
    publicAssetUrl('/textures/wall/BrickWall02.jpg'),
    publicAssetUrl('/textures/wall/BrickWall02_Normal.jpg'),
  ]);

  const sport =
  glbUrl.includes('Basketball') ? 'Basketball' :
  glbUrl.includes('BaseBall') || glbUrl.includes('Baseball') ? 'Baseball' :
  glbUrl.includes('Football') ? 'Football' :
  glbUrl.includes('Hockey') ? 'Hockey' :
  'Soccer';

  
    const vertexShader = `
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform float uIntensity;
  uniform float uFresnelPow;
  uniform float uRim;
  uniform float uFlatten;

  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    float peak = max(max(uColor1.r, uColor1.g), uColor1.b);
    vec3 hue = uColor1 / max(peak, 0.001);

    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(vViewDir);
    vec3 nFlat = normalize(mix(n, v * sign(dot(n, v) + 1e-5), uFlatten));

    float ndv = abs(dot(nFlat, v));
    float w = fwidth(ndv);
    float ndvAA = mix(ndv, smoothstep(-w, w, ndv), 0.35);
    float fresnel = pow(1.0 - clamp(ndvAA, 0.0, 1.0), uFresnelPow);

    vec3 col = hue * uIntensity * (1.0 + fresnel * uRim);

    float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
    col += dither * max(luma, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

  
  const neonMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  
  useEffect(() => {
    [c1, n1, c2, n2].forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
     tex.repeat.set(t.wallRepeatX, t.wallRepeatY);   
tex.anisotropy = 2;     
tex.generateMipmaps = true;
tex.minFilter = THREE.LinearMipmapLinearFilter;
tex.needsUpdate = true;
    });
    c1.colorSpace = c2.colorSpace = THREE.SRGBColorSpace;
    n1.colorSpace = n2.colorSpace = THREE.LinearSRGBColorSpace;
  }, [c1, n1, c2, n2, t.wallRepeatX, t.wallRepeatY]);
  
  const activeColorMap = textureVariant === 1 ? c1 : c2;
  const activeNormalMap = textureVariant === 1 ? n1 : n2;

  const isSoftOutline = SOFT_OUTLINE.some(
    (c) => c.toLowerCase() === outlineColor.toLowerCase()
  );
  const neonIntensity = isSoftOutline ? t.neonIntensitySoft : t.neonIntensityHard;

 useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const nameLower = child.name.toLowerCase();

      
  if (nameLower.includes('plane')) {
  const isTex2 = textureVariant === 2;

  child.material = new THREE.MeshStandardMaterial({
    map: activeColorMap,
    normalMap: activeNormalMap,
    normalScale: new THREE.Vector2(
      isTex2 ? t.wallNormal2 : t.wallNormal1,
      isTex2 ? t.wallNormal2 : t.wallNormal1,
    ),
    roughness: isTex2 ? t.wallRough2 : t.wallRough1,
    metalness: isTex2 ? t.wallMetal2 : t.wallMetal1,
    color: isTex2
      ? (isDark ? '#c8c8c8' : '#ffffff')
      : (isDark ? '#888888' : '#ffffff'),
    emissive: new THREE.Color('#000000'),
    emissiveIntensity: 0,
  });
  child.material.needsUpdate = true;
}
      
     
else if (nameLower.includes('neon')) { 

  if (!neonOn) {
    
    child.material = new THREE.MeshPhysicalMaterial({
      color: outlineColor,
      emissive: new THREE.Color(outlineColor),
      emissiveIntensity: t.neonOffEmissive, 
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 1.0,         
      clearcoatRoughness: 0.1,
      transparent: false,
    });
  } else {
    if (!neonMaterialRef.current) {
            neonMaterialRef.current = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(outlineColor) },
          uColor2: { value: new THREE.Color(outlineColor) },
          uIntensity: { value: neonIntensity },
          uFresnelPow: { value: t.fresnelPow },
          uRim: { value: t.rimBoost },
          uMouseWorld: { value: new THREE.Vector3(999, 999, 999) },
          uFlatten: { value: t.neonFlatten },
        },
        transparent: false,
        toneMapped: false,
        depthWrite: true,
        depthTest: true,
        side: THREE.DoubleSide,
        dithering: true,
      });
    } else {
      neonMaterialRef.current.uniforms.uColor1.value.set(outlineColor);
      neonMaterialRef.current.uniforms.uColor2.value.set(outlineColor);
      neonMaterialRef.current.uniforms.uIntensity.value = neonIntensity;
      neonMaterialRef.current.uniforms.uFresnelPow.value = t.fresnelPow;
      neonMaterialRef.current.uniforms.uRim.value = t.rimBoost;
      neonMaterialRef.current.uniforms.uFlatten.value = t.neonFlatten;
    }
    
    child.material = neonMaterialRef.current;
  }
  child.material.needsUpdate = true;
}

      
      else if (nameLower.includes('chain') || nameLower.includes('wire') || nameLower.includes('cord') || nameLower.includes('cable')) {
        
        const isChain = nameLower.includes('chain');
        child.material = new THREE.MeshStandardMaterial({
          color: isChain ? '#888888' : '#e0e0e0', 
          metalness: isChain ? 0.8 : 0.1,
          roughness: isChain ? 0.4 : 0.8,
        });
        child.material.needsUpdate = true;
      }

    
      else if (nameLower.includes('glass')) {
  const isClear =
    backboardColor === 'transparent' ||
    backboardColor === 'Transparent';

  child.visible = true;
  child.material = isClear
    ? new THREE.MeshPhysicalMaterial({
        color: '#e8eef5',
        metalness: 0,
        roughness: t.glassRough,
        transmission: 0,
        transparent: true,
        opacity: t.glassOpacity,
        depthWrite: false,
        side: THREE.FrontSide,
        envMapIntensity: 0,
        clearcoat: 0,
        reflectivity: 0,
        specularIntensity: 0,
      })
    : new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0,
        roughness: t.coverRough,
        transmission: 1,
        thickness: 0.02,
        ior: t.coverIor,
        transparent: true,
        opacity: 1,
        depthWrite: true,
        side: THREE.DoubleSide,
        envMapIntensity: t.coverEnv,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        reflectivity: 1,
        specularIntensity: 1,
      });
  child.material.needsUpdate = true;
}

      else {
        const isInnerMesh = nameLower.includes('jersey');
        const isClear =
          backboardColor === 'transparent' ||
          backboardColor === 'Transparent';

        if (!child.geometry.userData.normalsReady) {
          child.geometry.computeVertexNormals();
          child.geometry.userData.normalsReady = true;
        }

        const clearAcrylicMaterial = new THREE.MeshPhysicalMaterial({
          color: '#e8eef5',
          metalness: 0.0,
          roughness: t.acrylicRough,
          transmission: 0,
          ior: 1.5,
          thickness: 0,
          clearcoat: 0,
          clearcoatRoughness: 1,
          envMapIntensity: 0,
          transparent: true,
          opacity: t.acrylicOpacity,
          side: THREE.FrontSide,
          depthWrite: false,
          specularIntensity: 0,
          reflectivity: 0,
        });

       const solidColorMaterial = new THREE.MeshBasicMaterial({
  color: backboardColor,
  toneMapped: false,
  side: THREE.FrontSide,
});

        if (isInnerMesh && !isClear) {
          child.material = solidColorMaterial;
        } else {
          child.material = clearAcrylicMaterial;
        }

        child.material.needsUpdate = true;
      }
    });
  }, [clonedScene, outlineColor, backboardColor, neonOn, isDark, activeColorMap, activeNormalMap, textureVariant, t, neonIntensity, vertexShader, fragmentShader]);

    useEffect(() => {
    const mat = neonMaterialRef.current;
    if (!mat?.uniforms) return;
    mat.uniforms.uIntensity.value = neonIntensity;
    mat.uniforms.uColor1.value.set(outlineColor);
    mat.uniforms.uColor2.value.set(outlineColor);
    if (mat.uniforms.uFresnelPow) mat.uniforms.uFresnelPow.value = t.fresnelPow;
    if (mat.uniforms.uRim) mat.uniforms.uRim.value = t.rimBoost;
    if (mat.uniforms.uFlatten) mat.uniforms.uFlatten.value = t.neonFlatten;
  }, [neonIntensity, outlineColor, t.fresnelPow, t.rimBoost, t.neonFlatten]);

const isTex2 = textureVariant === 2;
const mul = isTex2 ? t.w2Multiply : t.w1Multiply;
const decay = isTex2 ? t.w2Falloff : t.w1Falloff;
const outlineGlow = isTex2 ? t.w2OutlineGlow : t.w1OutlineGlow;
const outlineReach = isTex2 ? t.w2OutlineReach : t.w1OutlineReach;
const nameGlow = isTex2 ? t.w2NameGlow : t.w1NameGlow;
const nameReach = isTex2 ? t.w2NameReach : t.w1NameReach;
const numberGlow = isTex2 ? t.w2NumberGlow : t.w1NumberGlow;
const numberReach = isTex2 ? t.w2NumberReach : t.w1NumberReach;

const bounceLights = neonOn
  ? [
      { pos: [0, t.bounceTopY, t.bounceZ] as const, color: outlineColor, intensity: outlineGlow * mul, distance: outlineReach },
      { pos: [0, t.bounceBotY, t.bounceZ] as const, color: outlineColor, intensity: outlineGlow * mul, distance: outlineReach },
      { pos: [0, t.bounceNameY, t.bounceTextZ] as const, color: nameColor, intensity: nameGlow * mul, distance: nameReach },
      { pos: [0, t.bounceNumberY, t.bounceTextZ] as const, color: numberColor, intensity: numberGlow * mul, distance: numberReach },
    ]
  : [];

return (
  <group position={[t.groupX, t.groupY, t.groupZ]} scale={t.groupScale}>
    {MODEL_DEBUG.panel && <ModelDebugPanel />}
    <primitive object={clonedScene} />

    {neonOn &&
      bounceLights.map((l, i) => (
        <pointLight
          key={i}
          position={l.pos}
          color={l.color}
          intensity={l.intensity}
          distance={l.distance}
          decay={decay}
          castShadow={false}
        />
      ))}

      {name && (
        <NeonText
  text={name}
  color={nameColor}
  position={[t.nameX, t.nameY, t.nameZ]}
  scale={1}
  curve={true}
  neonOn={neonOn}
  sport={sport}
/>
      )}

      {number && (
        <NeonText
          text={number}
          color={numberColor}
          position={[t.numX, t.numY, t.numZ]}
          scale={1}
          isNumber={true}
          curve={false}
          neonOn={neonOn}
          sport={sport}
        />
      )}
    </group>
  );
};

useGLTF.preload(SPORT_MODELS.Basketball);
useGLTF.preload(SPORT_MODELS.Baseball);
useGLTF.preload(SPORT_MODELS.Football);
useGLTF.preload(SPORT_MODELS.Soccer);
useGLTF.preload(SPORT_MODELS.Hockey);

export default React.memo(Model);