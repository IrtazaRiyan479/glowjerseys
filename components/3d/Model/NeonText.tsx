'use client';

import { useEffect, useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  Text3D,
  OrbitControls,
  PivotControls,
  useFont,
} from '@react-three/drei';


/* ===========================================================================
 - DEBUG SWITCHES
 - =========================================================================== */
const DEBUG = {
  orbit: false,
  panel: false,
  pivot: false,
};

/* ===========================================================================
 - DEFAULTS 
 - =========================================================================== */
const DEFAULTS = {
  /* ── font ─── */
  fontPathName: '/fonts/Avante.json',
  fontPathNumber: '/fonts/Mayfair.json',

  /* ── name size ── */
  nameSize1: 0.091,
  nameSize2: 0.088,
  nameSize3: 0.078,
  nameSize4: 0.068,
  nameSize5: 0.068,
  nameSize6: 0.061,
  nameSize7: 0.049,
  nameSize8: 0.039,
  nameSize9: 0.039,
  nameSize10: 0.033,
  nameSize11: 0.038,
  nameSize12: 0.034,
  nameSize13: 0.033,
  bbNameSizeShort: 0.058,
  bbNameSizeMid: 0.046,
  bbNameSizeLong: 0.038,
  bbNameSizeXLong: 0.034,

  /* ── number size ─── */
  numberSize1: 0.212,
  numberSize2: 0.173,
  numberSize3: 0.125,
  numberSize4: 0.096,
  bbNumberSize1: 0.199,
  bbNumberSize2: 0.16,
  bbNumberSize3: 0.138,
  bbNumberSize4: 0.113,

  /* ── constant gap  */
  nameLetterSpacing: 0,
  numberLetterSpacing: 0,

  /* ── extrusion / tube profile ─── */
  nameExtrusion: 0.009,
  numberExtrusion: 0.009,
  nameBevelThickness: 0.011,
  nameBevelSize: 0.0042,
  numberBevelThickness: 0.013,
  numberBevelSize: 0.005,
  bevelSegments: 8,
  curveSegments: 32,
  nameLineWidth: -0.001,
  numberLineWidth: -0.0018,

  /* ── basketball name arc */
  curveRadiusShort: 0, curveSagShort: 1, curveTiltShort: 1, curveXShort: -0.003, curveYShort: -0.001, curveZShort: -0.005,
  curveRadiusMid: 0, curveSagMid: 1, curveTiltMid: 1, curveXMid: -0.003, curveYMid: 0.017, curveZMid: 0,
  curveRadiusLong: 0, curveSagLong: 1, curveTiltLong: 1, curveXLong: -0.005, curveYLong: 0.025, curveZLong: 0,
  curveRadiusXLong: 0, curveSagXLong: 1, curveTiltXLong: 1, curveXXLong: -0.006, curveYXLong: 0.035, curveZXLong: 0.001,
  maxNameWidthBB: 0.7,
  maxNameWidthOther: 0.82,
  fitToWidth: true,

  /* ── Position offsets ── */
  nameX1: 0, nameY1: 0, nameZ1: 0.011,
  nameX2: 0.002, nameY2: 0.001, nameZ2: 0.01,
  nameX3: 0.002, nameY3: 0.002, nameZ3: 0.01,
  nameX4: 0.002, nameY4: 0.009, nameZ4: 0.01,
  nameX5: 0, nameY5: 0.01, nameZ5: 0.01,
  nameX6: 0.001, nameY6: 0.014, nameZ6: 0.01,
  nameX7: 0, nameY7: 0.018, nameZ7: 0.01,
  nameX8: 0, nameY8: 0.023, nameZ8: 0.01,
  nameX9: 0, nameY9: 0.023, nameZ9: 0.01,
  nameX10: 0, nameY10: 0.027, nameZ10: 0.01,
  nameX11: 0, nameY11: 0.028, nameZ11: 0.01,
  nameX12: 0, nameY12: 0.032, nameZ12: 0.01,
  nameX13: 0, nameY13: 0.032, nameZ13: 0.01,

  numX1: 0, numY1: -0.085, numZ1: 0,
  numX2: -0.004, numY2: -0.067, numZ2: 0,
  numX3: -0.003, numY3: -0.034, numZ3: 0.01,
  numX4: -0.003, numY4: -0.027, numZ4: 0,
  bbNumX1: 0, bbNumY1: -0.084, bbNumZ1: 0.01,
  bbNumX2: -0.002, bbNumY2: -0.072, bbNumZ2: 0.01,
  bbNumX3: -0.002, bbNumY3: -0.072, bbNumZ3: 0.01,
  bbNumX4: -0.003, bbNumY4: -0.05, bbNumZ4: 0.01,

  /* ── glow ─── */
  intensity: 2.2,
  softIntensity: 1.6,
  offIntensity: 0.75,
  coreWhite: 0.01,
  fresnelPow: 0,
  rimBoost: 0,
  physicalEmissive: 0.64,

  /* ── orbit ─── */
  orbitMin: 0.45,
  orbitMax: 6,
  orbitDamping: true,
};

function curveParamsForName(len: number, t: TweakState) {
  if (len <= 5) return { radius: t.curveRadiusShort, sag: t.curveSagShort, tilt: t.curveTiltShort, cx: t.curveXShort, cy: t.curveYShort, cz: t.curveZShort };
  if (len <= 8) return { radius: t.curveRadiusMid, sag: t.curveSagMid, tilt: t.curveTiltMid, cx: t.curveXMid, cy: t.curveYMid, cz: t.curveZMid };
  if (len <= 11) return { radius: t.curveRadiusLong, sag: t.curveSagLong, tilt: t.curveTiltLong, cx: t.curveXLong, cy: t.curveYLong, cz: t.curveZLong };
  return { radius: t.curveRadiusXLong, sag: t.curveSagXLong, tilt: t.curveTiltXLong, cx: t.curveXXLong, cy: t.curveYXLong, cz: t.curveZXLong };
}

function offsetParamsForName(len: number, sport: string, t: TweakState) {
  if (sport === 'Basketball') return { ox: 0, oy: 0, oz: 0, scale: 1 };
  return {
    ox: nameNum(t, 'X', len),
    oy: nameNum(t, 'Y', len),
    oz: nameNum(t, 'Z', len),
    scale: 1,
  };
}

function textWidth(
  fontData: any,
  chars: string[],
  size: number,
  extraGap: number,
) {
  if (!chars.length) return 0;
  let w = 0;
  for (let i = 0; i < chars.length; i++) {
    w += glyphAdvance(fontData, chars[i], size);
    if (i < chars.length - 1) w += extraGap;
  }
  return w;
}

function offsetParamsForNumber(len: number, sport: string, t: TweakState) {
  const bb = sport === 'Basketball';
  if (len <= 1) {
    return bb
      ? { ox: t.bbNumX1, oy: t.bbNumY1, oz: t.bbNumZ1, scale: 1 }
      : { ox: t.numX1, oy: t.numY1, oz: t.numZ1, scale: 1 };
  }
  if (len <= 2) {
    return bb
      ? { ox: t.bbNumX2, oy: t.bbNumY2, oz: t.bbNumZ2, scale: 1 }
      : { ox: t.numX2, oy: t.numY2, oz: t.numZ2, scale: 1 };
  }
  if (len <= 3) {
    return bb
      ? { ox: t.bbNumX3, oy: t.bbNumY3, oz: t.bbNumZ3, scale: 1 }
      : { ox: t.numX3, oy: t.numY3, oz: t.numZ3, scale: 1 };
  }
  return bb
    ? { ox: t.bbNumX4, oy: t.bbNumY4, oz: t.bbNumZ4, scale: 1 }
    : { ox: t.numX4, oy: t.numY4, oz: t.numZ4, scale: 1 };
}

type TweakState = typeof DEFAULTS;

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

const NAME_LEN_MAX = 13;

function clampNameLen(len: number) {
  return Math.min(NAME_LEN_MAX, Math.max(1, len));
}

function nameNum(
  t: TweakState,
  kind: 'Size' | 'X' | 'Y' | 'Z',
  len: number,
): number {
  return t[`name${kind}${clampNameLen(len)}` as keyof TweakState] as number;
}

interface NeonTextProps {
  text: string;
  color?: string;
  position?: [number, number, number];
  scale?: number;
  isNumber?: boolean;
  curve?: boolean;
  neonOn?: boolean;
  sport?: string;
}

const SOFT_COLORS = new Set([
  '#ffe800',
  '#fbeccb',
  '#e8c07a',
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
    float peak = max(max(uColor.r, uColor.g), uColor.b);
    vec3 hue = uColor / max(peak, 0.001);

    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(vViewDir);
    float ndv = abs(dot(n, v));
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

function sizeForName(len: number, sport: string, t: TweakState) {
  if (sport === 'Basketball') {
    if (len <= 5) return t.bbNameSizeShort;
    if (len <= 8) return t.bbNameSizeMid;
    if (len <= 11) return t.bbNameSizeLong;
    return t.bbNameSizeXLong;
  }
  return nameNum(t, 'Size', len);
}

function sizeForNumber(len: number, sport: string, t: TweakState) {
  const bb = sport === 'Basketball';
  if (len <= 1) return bb ? t.bbNumberSize1 : t.numberSize1;
  if (len <= 2) return bb ? t.bbNumberSize2 : t.numberSize2;
  if (len <= 3) return bb ? t.bbNumberSize3 : t.numberSize3;
  return bb ? t.bbNumberSize4 : t.numberSize4;
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

function fmtTweak(v: unknown): string {
  if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return String(v);
    return String(parseFloat(v.toFixed(6)));
  }
  return JSON.stringify(v);
}

function serializeTweaksAsDefaults(t: TweakState): string {
  const used = new Set<string>();
  const kv = (k: keyof TweakState) => {
    used.add(k as string);
    return `${k}: ${fmtTweak(t[k])}`;
  };
  const row = (keys: (keyof TweakState)[]) => keys.map(kv).join(', ');

  const body = `  /* ── font ─── */
  ${kv('fontPathName')},
  ${kv('fontPathNumber')},

  /* ── name size ── */
  ${Array.from({ length: 13 }, (_, i) => kv(`nameSize${i + 1}` as keyof TweakState)).join(',\n  ')},
  ${kv('bbNameSizeShort')},
  ${kv('bbNameSizeMid')},
  ${kv('bbNameSizeLong')},
  ${kv('bbNameSizeXLong')},

  /* ── number size ─── */
  ${kv('numberSize1')},
  ${kv('numberSize2')},
  ${kv('numberSize3')},
  ${kv('numberSize4')},
  ${kv('bbNumberSize1')},
  ${kv('bbNumberSize2')},
  ${kv('bbNumberSize3')},
  ${kv('bbNumberSize4')},

  /* ── constant gap  */
  ${kv('nameLetterSpacing')},
  ${kv('numberLetterSpacing')},

  /* ── extrusion / tube profile ─── */
  ${kv('nameExtrusion')},
  ${kv('numberExtrusion')},
  ${kv('nameBevelThickness')},
  ${kv('nameBevelSize')},
  ${kv('numberBevelThickness')},
  ${kv('numberBevelSize')},
  ${kv('bevelSegments')},
  ${kv('curveSegments')},
  ${kv('nameLineWidth')},
  ${kv('numberLineWidth')},

  /* ── basketball name arc */
  ${row(['curveRadiusShort', 'curveSagShort', 'curveTiltShort', 'curveXShort', 'curveYShort', 'curveZShort'])},
  ${row(['curveRadiusMid', 'curveSagMid', 'curveTiltMid', 'curveXMid', 'curveYMid', 'curveZMid'])},
  ${row(['curveRadiusLong', 'curveSagLong', 'curveTiltLong', 'curveXLong', 'curveYLong', 'curveZLong'])},
  ${row(['curveRadiusXLong', 'curveSagXLong', 'curveTiltXLong', 'curveXXLong', 'curveYXLong', 'curveZXLong'])},
  ${kv('maxNameWidthBB')},
  ${kv('maxNameWidthOther')},
  ${kv('fitToWidth')},

  /* ── Position offsets ── */
  ${Array.from({ length: 13 }, (_, i) =>
    row([
      `nameX${i + 1}` as keyof TweakState,
      `nameY${i + 1}` as keyof TweakState,
      `nameZ${i + 1}` as keyof TweakState,
    ]),
  ).join(',\n  ')},

  ${row(['numX1', 'numY1', 'numZ1'])},
  ${row(['numX2', 'numY2', 'numZ2'])},
  ${row(['numX3', 'numY3', 'numZ3'])},
  ${row(['numX4', 'numY4', 'numZ4'])},
  ${row(['bbNumX1', 'bbNumY1', 'bbNumZ1'])},
  ${row(['bbNumX2', 'bbNumY2', 'bbNumZ2'])},
  ${row(['bbNumX3', 'bbNumY3', 'bbNumZ3'])},
  ${row(['bbNumX4', 'bbNumY4', 'bbNumZ4'])},

  /* ── glow ─── */
  ${kv('intensity')},
  ${kv('softIntensity')},
  ${kv('offIntensity')},
  ${kv('coreWhite')},
  ${kv('fresnelPow')},
  ${kv('rimBoost')},
  ${kv('physicalEmissive')},

  /* ── orbit ─── */
  ${kv('orbitMin')},
  ${kv('orbitMax')},
  ${kv('orbitDamping')},`;

  const missing = (Object.keys(DEFAULTS) as (keyof TweakState)[]).filter(
    (k) => !used.has(k as string),
  );
  const extra = missing.length
    ? `\n\n  /* ── extra ── */\n` +
      missing.map((k) => `  ${kv(k)},`).join('\n')
    : '';

  return `const DEFAULTS = {\n${body}${extra}\n};`;
}

function DebugPanel({ sport, isNumber, len }: { sport: string; isNumber: boolean; len: number; }) {
  const t = useTweaks();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isNumber) return;
    if (typeof document === 'undefined') return;

    const host = document.createElement('div');
    host.id = 'neon-text-debug-panel';
    document.body.appendChild(host);
    const root: Root = createRoot(host);

        const checkbox = (
      label: string,
      key: keyof TweakState,
      values: TweakState,
    ) => (
      <label
        key={key}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          marginBottom: 6,
          color: '#d8d8d8',
        }}
      >
        <input
          type="checkbox"
          checked={Boolean(values[key])}
          onChange={(e) => patchTweaks({ [key]: e.target.checked })}
        />
        {label}
      </label>
    );

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
              3D NEON TEXT TWEAKS · {sport}
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
              <Section title="Name size (by length)">
                {Array.from({ length: 13 }, (_, i) =>
                  slider(
                    `${i + 1} char${i ? 's' : ''}${len === i + 1 ? '  ←' : ''}`,
                    `nameSize${i + 1}` as keyof TweakState,
                    0.02,
                    0.3,
                    0.001,
                    values,
                    setOpen,
                    openVal,
                  ),
                )}
                {slider('bb ≤5', 'bbNameSizeShort', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb 6–8', 'bbNameSizeMid', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb 9–11', 'bbNameSizeLong', 0.04, 0.3, 0.001, values, setOpen, openVal)}
                {slider('bb 12+', 'bbNameSizeXLong', 0.04, 0.3, 0.001, values, setOpen, openVal)}
              </Section>
              <Section title="Number size (by length)">
                {slider('other 1 digit', 'numberSize1', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('other 2 digit', 'numberSize2', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('other 3 digit', 'numberSize3', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('other 4 digit', 'numberSize4', 0.04, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 1 digit', 'bbNumberSize1', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 2 digit', 'bbNumberSize2', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 3 digit', 'bbNumberSize3', 0.06, 0.45, 0.001, values, setOpen, openVal)}
                {slider('bb 4 digit', 'bbNumberSize4', 0.04, 0.45, 0.001, values, setOpen, openVal)}
              </Section>
              <Section title="Constant letter gap">
                {slider('name spacing', 'nameLetterSpacing', 0, 0.08, 0.001, values, setOpen, openVal)}
                {slider('number spacing', 'numberLetterSpacing', 0, 0.1, 0.001, values, setOpen, openVal)}
              </Section>
              <Section title="Extrusion / bevel (tube)">
                {slider('name extrusion', 'nameExtrusion', 0.004, 0.12, 0.001, values, setOpen, openVal)}
                {slider('number extrusion', 'numberExtrusion', 0.004, 0.12, 0.001, values, setOpen, openVal)}
                {slider('name bevel thick', 'nameBevelThickness', 0, 0.04, 0.0005, values, setOpen, openVal)}
                {slider('name bevel size', 'nameBevelSize', 0, 0.02, 0.0002, values, setOpen, openVal)}
                {slider('num bevel thick', 'numberBevelThickness', 0, 0.04, 0.0005, values, setOpen, openVal)}
                {slider('num bevel size', 'numberBevelSize', 0, 0.02, 0.0002, values, setOpen, openVal)}
                {slider('name boldness', 'nameLineWidth', -0.01, 0.03, 0.0002, values, setOpen, openVal)}
                {slider('number boldness', 'numberLineWidth', -0.01, 0.03, 0.0002, values, setOpen, openVal)}
                {/* {slider('bevel segments', 'bevelSegments', 1, 12, 1, values, setOpen, openVal)}
                {slider('curve segments', 'curveSegments', 4, 32, 1, values, setOpen, openVal)} */}
              </Section>
              <Section title="Basketball curve">
                <details style={{ marginLeft: 8, marginBottom: 6 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Short (1-5 chars)</summary>
                  {slider('radius', 'curveRadiusShort', 0.0, 5.4, 0.01, values, setOpen, openVal)}
                  {/* {slider('sag', 'curveSagShort', 0, 1.4, 0.01, values, setOpen, openVal)}
                  {slider('tilt', 'curveTiltShort', 0, 1.4, 0.01, values, setOpen, openVal)} */}
                  {slider('curve X', 'curveXShort', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                  {slider('curve Y', 'curveYShort', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  {slider('curve Z', 'curveZShort', -0.1, 0.1, 0.001, values, setOpen, openVal)}
                </details>
                <details style={{ marginLeft: 8, marginBottom: 6 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Mid (6-8 chars)</summary>
                  {slider('radius', 'curveRadiusMid', 0.0, 5.4, 0.01, values, setOpen, openVal)}
                  {/* {slider('sag', 'curveSagMid', 0, 1.4, 0.01, values, setOpen, openVal)}
                  {slider('tilt', 'curveTiltMid', 0, 1.4, 0.01, values, setOpen, openVal)} */}
                  {slider('curve X', 'curveXMid', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                  {slider('curve Y', 'curveYMid', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  {slider('curve Z', 'curveZMid', -0.1, 0.1, 0.001, values, setOpen, openVal)}
                </details>
                <details style={{ marginLeft: 8, marginBottom: 6 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Long (9-11 chars)</summary>
                  {slider('radius', 'curveRadiusLong', 0.0, 5.4, 0.01, values, setOpen, openVal)}
                  {/* {slider('sag', 'curveSagLong', 0, 1.4, 0.01, values, setOpen, openVal)}
                  {slider('tilt', 'curveTiltLong', 0, 1.4, 0.01, values, setOpen, openVal)} */}
                  {slider('curve X', 'curveXLong', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                  {slider('curve Y', 'curveYLong', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  {slider('curve Z', 'curveZLong', -0.1, 0.1, 0.001, values, setOpen, openVal)}
                </details>
                <details style={{ marginLeft: 8, marginBottom: 6 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>XLong (12+ chars)</summary>
                  {slider('radius', 'curveRadiusXLong', 0.0, 5.4, 0.01, values, setOpen, openVal)}
                  {/* {slider('sag', 'curveSagXLong', 0, 1.4, 0.01, values, setOpen, openVal)}
                  {slider('tilt', 'curveTiltXLong', 0, 1.4, 0.01, values, setOpen, openVal)} */}
                  {slider('curve X', 'curveXXLong', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                  {slider('curve Y', 'curveYXLong', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  {slider('curve Z', 'curveZXLong', -0.1, 0.1, 0.001, values, setOpen, openVal)}
                </details>
                
                <div style={{ marginTop: 8 }}>
                  {checkbox('fit to max width', 'fitToWidth', values)}
                  {slider('max width BB', 'maxNameWidthBB', 0.3, 1.4, 0.01, values, setOpen, openVal)}
                  {slider('max width other', 'maxNameWidthOther', 0.3, 1.4, 0.01, values, setOpen, openVal)}
                </div>
              </Section>
              <Section title="Position offsets">
                <div style={{ marginTop: 12 }}>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Number (1 digit)</summary>
                    {slider('number X', 'numX1', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Y', 'numY1', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Z', 'numZ1', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Number (2 digits)</summary>
                    {slider('number X', 'numX2', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Y', 'numY2', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Z', 'numZ2', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Number (3 digits)</summary>
                    {slider('number X', 'numX3', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Y', 'numY3', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Z', 'numZ3', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>Number (4 digits)</summary>
                    {slider('number X', 'numX4', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Y', 'numY4', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('number Z', 'numZ4', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>BB Number (1 digit)</summary>
                    {slider('bb number X', 'bbNumX1', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Y', 'bbNumY1', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Z', 'bbNumZ1', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>BB Number (2 digits)</summary>
                    {slider('bb number X', 'bbNumX2', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Y', 'bbNumY2', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Z', 'bbNumZ2', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>BB Number (3 digits)</summary>
                    {slider('bb number X', 'bbNumX3', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Y', 'bbNumY3', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Z', 'bbNumZ3', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                  <details style={{ marginLeft: 8, marginBottom: 6 }}>
                    <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>BB Number (4 digits)</summary>
                    {slider('bb number X', 'bbNumX4', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Y', 'bbNumY4', -0.4, 0.4, 0.001, values, setOpen, openVal)}
                    {slider('bb number Z', 'bbNumZ4', -0.2, 0.2, 0.001, values, setOpen, openVal)}
                  </details>
                </div>
              </Section>
              <Section title="Name position (by character count)">
                    {Array.from({ length: 13 }, (_, i) => (
                      <details
                        key={i}
                        open={len === i + 1}
                        style={{ marginLeft: 8, marginBottom: 6 }}
                      >
                        <summary style={{ cursor: 'pointer', fontSize: 10, color: '#aaa', marginBottom: 4 }}>
                          {i + 1} char{i ? 's' : ''}
                          {len === i + 1 ? '  ← current' : ''}
                        </summary>
                        {slider('name X', `nameX${i + 1}` as keyof TweakState, -0.4, 0.4, 0.001, values, setOpen, openVal)}
                        {slider('name Y', `nameY${i + 1}` as keyof TweakState, -0.4, 0.4, 0.001, values, setOpen, openVal)}
                        {slider('name Z', `nameZ${i + 1}` as keyof TweakState, -0.2, 0.2, 0.001, values, setOpen, openVal)}
                      </details>
                    ))}
                  </Section>
              <Section title="Glow (TEXT)">
                {slider('intensity', 'intensity', 0, 20, 0.1, values, setOpen, openVal)}
                {slider('soft intensity', 'softIntensity', 0, 20, 0.1, values, setOpen, openVal)}
                {slider('off intensity', 'offIntensity', 0, 2, 0.01, values, setOpen, openVal)}
                {slider('core white', 'coreWhite', 0, 1, 0.01, values, setOpen, openVal)}
                {slider('fresnel pow', 'fresnelPow', 0.4, 6, 0.05, values, setOpen, openVal)}
                {slider('rim boost', 'rimBoost', 0, 4, 0.05, values, setOpen, openVal)}
                {slider('physical emissive', 'physicalEmissive', 0, 2, 0.01, values, setOpen, openVal)}
              </Section>
              <Section title="Orbit">
                {slider('min dist', 'orbitMin', 0.1, 3, 0.05, values, setOpen, openVal)}
                {slider('max dist', 'orbitMax', 1, 12, 0.1, values, setOpen, openVal)}
              </Section>
              <AnimatedCopyButton 
                label="COPY TWEAKS TO CLIPBOARD" 
                onCopy={() => serializeTweaksAsDefaults(tweaks)} 
              />
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
  const lineWidth = isNumber ? t.numberLineWidth : t.nameLineWidth;

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
      side: THREE.FrontSide,
      dithering: true,
    });
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
      side: THREE.FrontSide,
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

        const offsets = isNumber ? offsetParamsForNumber(len, sport, t) : offsetParamsForName(len, sport, t);

  const ox = offsets.ox;
  const oy = offsets.oy;
  const oz = offsets.oz;
  const sc = scale * offsets.scale;

  if (!raw) return null;

  const common = {
    font: fontPath,
    height: extrusion,
    curveSegments: Math.max(1, Math.round(t.curveSegments)),
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelOffset: lineWidth,
    bevelSegments: Math.max(1, Math.round(t.bevelSegments)),
    material: mat,
  } as const;

    const renderCurved = () => {
    const res = fontData?.resolution || 1000;
    const widths = chars.map((c) => glyphAdvance(fontData, c, size));
    const xMids = chars.map((c) => {
      const g =
        fontData?.glyphs?.[c] ||
        fontData?.glyphs?.[c.toUpperCase()] ||
        fontData?.glyphs?.['?'];
      const xMin = g?.x_min ?? 0;
      const xMax = g?.x_max ?? (g?.ha ?? 700);
      return (((xMin + xMax) / 2) / res) * size;
    });

    const centers: number[] = [];
    let cursor = 0;
    for (let i = 0; i < len; i++) {
      centers.push(cursor + widths[i] / 2);
      cursor += widths[i] + (i < len - 1 ? extraGap : 0);
    }
    const mid = cursor / 2;

    const { radius: rawRadius, sag, tilt, cx, cy, cz } = curveParamsForName(len, t);
    const radius = Math.max(0.15, rawRadius);

    return chars.map((ch, i) => {
      const arc = centers[i] - mid;
      const angle = arc / radius;

      const x = Math.sin(angle) * radius + cx;
      const y = (Math.cos(angle) - 1) * radius * sag + cy;
      const z = cz;
      const rotZ = -angle * tilt;

      return (
        <group key={`${ch}-${i}`} position={[x, y, z]} rotation={[0, 0, rotZ]}>
          <group position={[-xMids[i], 0, 0]}>
            <Text3D {...common} size={size}>
              {ch}
            </Text3D>
          </group>
        </group>
      );
    });
  };

  const renderFlat = () => {
    const w = textWidth(fontData, chars, size, extraGap);
    return (
      <group position={[-w / 2, 0, 0]}>
        <Text3D {...common} size={size} letterSpacing={extraGap}>
          {raw}
        </Text3D>
      </group>
    );
  };

  const content = (
    <group
      position={[position[0] + ox, position[1] + oy, position[2] + oz]}
      scale={sc}
    >
      {useCurve ? renderCurved() : renderFlat()}
    </group>
  );

  const debug = DEBUG.panel ? (
    <DebugPanel sport={sport} isNumber={isNumber} len={len} />
  ) : null;

  if (!raw) return <>{debug}</>;

  return (
    <>
      {debug}

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
