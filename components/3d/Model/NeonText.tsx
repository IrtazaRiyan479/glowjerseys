'use client';

import { useEffect, useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  Text3D,
  Center,
  OrbitControls,
  PivotControls,
  useFont,
} from '@react-three/drei';


/* ═══════════════════════════════════════════════════════════════════════════
 * DEBUG SWITCHES
 * ═══════════════════════════════════════════════════════════════════════════ */
const DEBUG = {
  orbit: false,
  panel: false,
  pivot: false,
};

/* ═══════════════════════════════════════════════════════════════════════════
 * DEFAULTS  —  live panel writes on top of these
 * ═══════════════════════════════════════════════════════════════════════════ */
const DEFAULTS = {
  /* ── font ─────────────────────────────────────────────── */
  fontPathName: '/fonts/Avante.json',
  fontPathNumber: '/fonts/Mayfair.json',

  /* ── name size (world units). Length only changes SIZE, never gap. */
  nameSizeShort: 0.152, // 1–5
  nameSizeMid: 0.132, // 6–8
  nameSizeLong: 0.112, // 9–11
  nameSizeXLong: 0.094, // 12+
  bbNameSizeShort: 0.128,
  bbNameSizeMid: 0.112,
  bbNameSizeLong: 0.096,
  bbNameSizeXLong: 0.082,

  /* ── number size ──────────────────────────────────────── */
  numberSize1: 0.268,
  numberSize2: 0.248,
  numberSize3: 0.210,
  bbNumberSize1: 0.228,
  bbNumberSize2: 0.208,
  bbNumberSize3: 0.176,

  /* ── constant extra gap added after each glyph (NOT length-based) */
  nameLetterSpacing: 0.018,
  numberLetterSpacing: 0.028,

  /* ── extrusion / tube profile ─────────────────────────── */
  nameExtrusion: 0.036,
  numberExtrusion: 0.040,
  nameBevelThickness: 0.011,
  nameBevelSize: 0.0042,
  numberBevelThickness: 0.013,
  numberBevelSize: 0.0050,
  bevelSegments: 4,
  curveSegments: 12,

  /* ── basketball name arc (constant radius + constant gap) */
  curveRadius: 0.98,
  curveSag: 0.46, // 1 = true circle (ends drop more); lower = flatter
  curveTilt: 0.95, // 1 = letters fully tangent to the arc
  curveY: 0.012,
  curveZ: 0,
  maxNameWidthBB: 0.74,
  maxNameWidthOther: 0.82,
  fitToWidth: true,

  /* ── extra offsets on top of the position prop from Model.tsx */
  nameX: 0,
  nameY: 0,
  nameZ: 0,
  numberX: 0,
  numberY: 0,
  numberZ: 0,
  nameScale: 1,
  numberScale: 1,

  /* ── glow ─────────────────────────────────────────────── */
  intensity: 9.2,
  softIntensity: 5.2,
  offIntensity: 0.28,
  coreWhite: 0.18,
  fresnelPow: 2.4,
  rimBoost: 1.15,
  physicalEmissive: 0.32,

  /* ── orbit ────────────────────────────────────────────── */
  orbitMin: 0.45,
  orbitMax: 6,
  orbitDamping: true,
};

type TweakState = typeof DEFAULTS;

/* ── tiny store so NAME + NUMBER share the same live values ─────────────── */
let tweaks: TweakState = { ...DEFAULTS };
const listeners = new Set<(s: TweakState) => void>();

function patchTweaks(partial: Partial<TweakState>) {
  tweaks = { ...tweaks, ...partial };
  listeners.forEach((fn) => fn(tweaks));
}

function useTweaks(): TweakState {
  const [s, set] = useState(tweaks);
  useEffect(() => {
    listeners.add(set);
    return () => {
      listeners.delete(set);
    };
  }, []);
  return s;
}

/* ═══════════════════════════════════════════════════════════════════════════ */

interface NeonTextProps {
  text: string;
  color?: string;
  position?: [number, number, number];
  scale?: number;
  isNumber?: boolean;
  curve?: boolean; // ignored — basketball names always curve
  neonOn?: boolean;
  sport?: string;
}

const SOFT_COLORS = new Set([
  '#ffe800',
  '#fbeccb',
  '#ffffff',
  '#ffff00',
  '#fff700',
  '#ffee00',
  '#f5e6a3',
  '#f0e68c',
  '#fffacd',
  '#fff8dc',
]);

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
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uCore;
  uniform float uFresnelPow;
  uniform float uRim;

  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(vViewDir);
    float ndv = abs(dot(n, v));
    float fresnel = pow(1.0 - clamp(ndv, 0.0, 1.0), uFresnelPow);

    float peak = max(max(uColor.r, uColor.g), uColor.b);
    vec3 sameHueHot = uColor / max(peak, 0.001);
    vec3 hot = mix(uColor, sameHueHot, uCore);

    vec3 col = hot * uIntensity + uColor * fresnel * uRim * uIntensity;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function sizeForName(len: number, sport: string, t: TweakState) {
  const bb = sport === 'Basketball';
  if (len <= 5) return bb ? t.bbNameSizeShort : t.nameSizeShort;
  if (len <= 8) return bb ? t.bbNameSizeMid : t.nameSizeMid;
  if (len <= 11) return bb ? t.bbNameSizeLong : t.nameSizeLong;
  return bb ? t.bbNameSizeXLong : t.nameSizeXLong;
}

function sizeForNumber(len: number, sport: string, t: TweakState) {
  const bb = sport === 'Basketball';
  if (len <= 1) return bb ? t.bbNumberSize1 : t.numberSize1;
  if (len <= 2) return bb ? t.bbNumberSize2 : t.numberSize2;
  return bb ? t.bbNumberSize3 : t.numberSize3;
}

function glyphAdvance(
  fontData: any,
  ch: string,
  size: number,
): number {
  const g =
    fontData?.glyphs?.[ch] ||
    fontData?.glyphs?.[ch.toUpperCase()] ||
    fontData?.glyphs?.['?'];
  const ha = g?.ha ?? 700;
  const res = fontData?.resolution || 1000;
  return (ha / res) * size;
}

/* ── live slider panel (DOM, outside the canvas) ─────────────────────────── */
function DebugPanel({ sport, isNumber }: { sport: string; isNumber: boolean }) {
  const t = useTweaks();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isNumber) return;
    if (typeof document === 'undefined') return;

    const host = document.createElement('div');
    host.id = 'neon-text-debug-panel';
    document.body.appendChild(host);
    const root: Root = createRoot(host);

    const slider = (
      label: string,
      key: keyof TweakState,
      min: number,
      max: number,
      step: number,
      values: TweakState,
      setOpenFn: React.Dispatch<React.SetStateAction<boolean>>,
      openVal: boolean,
    ) => (
      <label
        key={key}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 58px',
          gap: 6,
          alignItems: 'center',
          fontSize: 11,
          marginBottom: 4,
          color: '#d8d8d8',
        }}
      >
        <span>
          {label}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[key] as number}
            onChange={(e) => patchTweaks({ [key]: parseFloat(e.target.value) })}
            style={{ width: '100%', display: 'block' }}
          />
        </span>
        <input
          type="number"
          step={step}
          value={Number(values[key])}
          onChange={(e) => patchTweaks({ [key]: parseFloat(e.target.value) })}
          style={{
            width: 58,
            fontSize: 11,
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: 4,
            padding: '2px 4px',
          }}
        />
      </label>
    );

    const renderPanel = (values: TweakState, openVal: boolean) => {
      root.render(
        <div
          style={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: 99999,
            width: 280,
            maxHeight: '96vh',
            overflow: 'auto',
            background: 'rgba(12,12,14,0.92)',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: 10,
            padding: 10,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, letterSpacing: 0.4, fontWeight: 700 }}>
              3D NEON TWEAKS · {sport}
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              style={{
                background: '#222',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: 4,
                padding: '2px 8px',
                cursor: 'pointer',
              }}
            >
              {openVal ? 'hide' : 'show'}
            </button>
          </div>
          {openVal && (
            <>
              <p style={{ fontSize: 10, color: '#888', margin: '0 0 8px' }}>
                Curve = basketball names only. Letter gap is constant. Copy values
                into DEFAULTS when done.
              </p>
              {/* <Section title="Name size (by length)">
                {slider('other ≤5', 'nameSizeShort', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('other 6–8', 'nameSizeMid', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('other 9–11', 'nameSizeLong', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('other 12+', 'nameSizeXLong', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb ≤5', 'bbNameSizeShort', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb 6–8', 'bbNameSizeMid', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb 9–11', 'bbNameSizeLong', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb 12+', 'bbNameSizeXLong', 0.04, 0.3, 0.001, values, setOpen, openVal)}
              </Section> */}
              {/* <Section title="Number size">
                {slider('other 1 digit', 'numberSize1', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('other 2 digit', 'numberSize2', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('other 3+ digit', 'numberSize3', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 1 digit', 'bbNumberSize1', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 2 digit', 'bbNumberSize2', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 3+ digit', 'bbNumberSize3', 0.06, 0.45, 0.001, values, setOpen, openVal)}
              </Section> */}
              <Section title="Constant letter gap">
                {slider('name gap', 'nameLetterSpacing', 0, 0.08, 0.001, values, setOpen, openVal)}
                {slider('number gap', 'numberLetterSpacing', 0, 0.1, 0.001, values, setOpen, openVal)}
              </Section>
              {/* <Section title="Extrusion / bevel (tube)">
                {slider('name extrusion', 'nameExtrusion', 0.004, 0.12, 0.001, values, setOpen, openVal)}
                {slider('number extrusion', 'numberExtrusion', 0.004, 0.12, 0.001, values, setOpen, openVal)}
                {slider('name bevel thick', 'nameBevelThickness', 0, 0.04, 0.0005, values, setOpen, openVal)}
                {slider('name bevel size', 'nameBevelSize', 0, 0.02, 0.0002, values, setOpen, openVal)}
                {slider('num bevel thick', 'numberBevelThickness', 0, 0.04, 0.0005, values, setOpen, openVal)}
                {slider('num bevel size', 'numberBevelSize', 0, 0.02, 0.0002, values, setOpen, openVal)}
                {slider('bevel segments', 'bevelSegments', 1, 12, 1, values, setOpen, openVal)}
                {slider('curve segments', 'curveSegments', 4, 32, 1, values, setOpen, openVal)}
              </Section> */}
              <Section title="Basketball curve">
                {slider('radius', 'curveRadius', 0.3, 2.4, 0.01, values, setOpen, openVal)}
                {slider('sag', 'curveSag', 0, 1.4, 0.01, values, setOpen, openVal)}
                {slider('letter tilt', 'curveTilt', 0, 1.4, 0.01, values, setOpen, openVal)}
                {slider('curve Y', 'curveY', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                {slider('curve Z', 'curveZ', -0.1, 0.1, 0.001, values, setOpen, openVal)}
                {slider('max width BB', 'maxNameWidthBB', 0.3, 1.4, 0.01, values, setOpen, openVal)}
                {slider('max width other', 'maxNameWidthOther', 0.3, 1.4, 0.01, values, setOpen, openVal)}
              </Section>
              {/* <Section title="Position / scale offsets">
                {slider('name X', 'nameX', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                {slider('name Y', 'nameY', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                {slider('name Z', 'nameZ', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                {slider('number X', 'numberX', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                {slider('number Y', 'numberY', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                {slider('number Z', 'numberZ', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                {slider('name scale', 'nameScale', 0.4, 2, 0.01, values, setOpen, openVal)}
                {slider('number scale', 'numberScale', 0.4, 2, 0.01, values, setOpen, openVal)}
              </Section> */}
              {/* <Section title="Glow">
                {slider('intensity', 'intensity', 0, 20, 0.1, values, setOpen, openVal)}
                {slider('soft intensity', 'softIntensity', 0, 20, 0.1, values, setOpen, openVal)}
                {slider('off intensity', 'offIntensity', 0, 2, 0.01, values, setOpen, openVal)}
                {slider('core white', 'coreWhite', 0, 1, 0.01, values, setOpen, openVal)}
                {slider('fresnel pow', 'fresnelPow', 0.4, 6, 0.05, values, setOpen, openVal)}
                {slider('rim boost', 'rimBoost', 0, 4, 0.05, values, setOpen, openVal)}
                {slider('physical emissive', 'physicalEmissive', 0, 2, 0.01, values, setOpen, openVal)}
              </Section> */}
              <Section title="Orbit">
                {slider('min dist', 'orbitMin', 0.1, 3, 0.05, values, setOpen, openVal)}
                {slider('max dist', 'orbitMax', 1, 12, 0.1, values, setOpen, openVal)}
              </Section>
              <button
                type="button"
                onClick={() => {
                  console.log('[3DNeonText DEFAULTS]', tweaks);
                  navigator.clipboard?.writeText(JSON.stringify(tweaks, null, 2));
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
                  cursor: 'pointer',
                }}
              >
                COPY TWEAKS TO CLIPBOARD
              </button>
            </>
          )}
        </div>,
      );
    };

    renderPanel(tweaks, open);
    const unsub = (s: TweakState) => renderPanel(s, open);
    listeners.add(unsub);

    return () => {
      listeners.delete(unsub);
      root.unmount();
      host.remove();
    };
  }, [isNumber, sport, open]);

  // Critical: return null so R3F never sees DOM nodes
  return null;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open style={{ marginBottom: 8 }}>
      <summary
        style={{
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 700,
          color: '#9ad',
          marginBottom: 4,
        }}
      >
        {title}
      </summary>
      {children}
    </details>
  );
}

export default function NeonText({
  text,
  color = '#ffffff',
  position = [0, 0, 0.02],
  scale = 1,
  isNumber = false,
  neonOn = true,
  sport = 'Soccer',
}: NeonTextProps) {
  const t = useTweaks();
  const fontPath = isNumber ? t.fontPathNumber : t.fontPathName;
  const font = useFont(fontPath);
  const fontData = (font as any)?.data;

  const raw = (text ?? '').toUpperCase();
  const chars = raw.split('');
  const len = chars.length;

  const isBasketball = sport === 'Basketball';
  const useCurve = isBasketball && !isNumber && len > 0;

  const baseSize = isNumber
    ? sizeForNumber(len, sport, t)
    : sizeForName(len, sport, t);

  const extraGap = isNumber ? t.numberLetterSpacing : t.nameLetterSpacing;
  const extrusion = isNumber ? t.numberExtrusion : t.nameExtrusion;
  const bevelThickness = isNumber ? t.numberBevelThickness : t.nameBevelThickness;
  const bevelSize = isNumber ? t.numberBevelSize : t.nameBevelSize;

  /* Fit-to-width: shrink SIZE only, keep the same extra gap */
  const size = useMemo(() => {
    if (!len) return baseSize;
    const maxW = isBasketball ? t.maxNameWidthBB : t.maxNameWidthOther;
    if (isNumber || !t.fitToWidth) return baseSize;
    const widths = chars.map((c) => glyphAdvance(fontData, c, baseSize));
    const total =
      widths.reduce((a, b) => a + b, 0) + extraGap * Math.max(0, len - 1);
    if (total <= maxW || total <= 0) return baseSize;
    return baseSize * (maxW / total);
  }, [baseSize, chars, extraGap, fontData, isBasketball, isNumber, len, t.fitToWidth, t.maxNameWidthBB, t.maxNameWidthOther]);

  const isSoft = SOFT_COLORS.has(color.toLowerCase());
  const activeIntensity = neonOn
    ? isSoft
      ? t.softIntensity
      : t.intensity
    : t.offIntensity;

  const neonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: activeIntensity },
        uCore: { value: t.coreWhite },
        uFresnelPow: { value: t.fresnelPow },
        uRim: { value: t.rimBoost },
      },
      transparent: false,
      toneMapped: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
    });
    // uniforms are updated in useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const physicalMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: isSoft ? t.physicalEmissive * 0.6 : t.physicalEmissive,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
  }, [color, isSoft, t.physicalEmissive]);

  useFrame(() => {
  const u = neonMaterial.uniforms;
  if (!u) return;
  if (u.uIntensity.value !== activeIntensity) u.uIntensity.value = activeIntensity;
  if (u.uCore.value !== t.coreWhite) u.uCore.value = t.coreWhite;
  if (u.uFresnelPow.value !== t.fresnelPow) u.uFresnelPow.value = t.fresnelPow;
  if (u.uRim.value !== t.rimBoost) u.uRim.value = t.rimBoost;
  neonMaterial.uniforms.uColor.value.set(color);
});

  const mat = neonOn ? neonMaterial : physicalMaterial;

  const ox = isNumber ? t.numberX : t.nameX;
  const oy = isNumber ? t.numberY : t.nameY;
  const oz = isNumber ? t.numberZ : t.nameZ;
  const sc = scale * (isNumber ? t.numberScale : t.nameScale);

  if (!raw) return null;

  const common = {
    font: fontPath,
    height: extrusion,
    curveSegments: Math.max(1, Math.round(t.curveSegments)),
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelSegments: Math.max(1, Math.round(t.bevelSegments)),
    material: mat,
  } as const;

  const renderCurved = () => {
    const widths = chars.map((c) => glyphAdvance(fontData, c, size));
    const centers: number[] = [];
    let cursor = 0;
    for (let i = 0; i < len; i++) {
      centers.push(cursor + widths[i] / 2);
      cursor += widths[i] + (i < len - 1 ? extraGap : 0);
    }
    const mid = cursor / 2;
    const radius = Math.max(0.15, t.curveRadius);

    return chars.map((ch, i) => {
      const s = centers[i] - mid;
      const angle = s / radius;
      const x = Math.sin(angle) * radius;
      const y = (Math.cos(angle) - 1) * radius * t.curveSag + t.curveY;
      const z = t.curveZ;
      const rotZ = -angle * t.curveTilt;

      return (
        <group key={`${ch}-${i}`} position={[x, y, z]} rotation={[0, 0, rotZ]}>
          <Center>
            <Text3D {...common} size={size}>
              {ch}
            </Text3D>
          </Center>
        </group>
      );
    });
  };

  const renderFlat = () => (
    <Center>
      <Text3D {...common} size={size} letterSpacing={extraGap}>
        {raw}
      </Text3D>
    </Center>
  );

  const content = (
    <group
      position={[position[0] + ox, position[1] + oy, position[2] + oz]}
      scale={sc}
    >
      {useCurve ? renderCurved() : renderFlat()}
    </group>
  );

  return (
    <>
      {DEBUG.panel && <DebugPanel sport={sport} isNumber={isNumber} />}

      {DEBUG.orbit && !isNumber && (
        <OrbitControls
          makeDefault
          enableDamping={t.orbitDamping}
          dampingFactor={0.08}
          minDistance={t.orbitMin}
          maxDistance={t.orbitMax}
          enablePan
          enableRotate
          enableZoom
        />
      )}

      {DEBUG.pivot ? (
        <PivotControls
          scale={0.18}
          lineWidth={2}
          depthTest={false}
          disableSliders={false}
          annotations
        >
          {content}
        </PivotControls>
      ) : (
        content
      )}
    </>
  );
}
