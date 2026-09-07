'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface NeonTextProps {
  text: string;
  color?: string;
  position?: [number, number, number];
  scale?: number;
  isNumber?: boolean;
  curve?: boolean;
  /** When false, text still shows but without the strong neon glow */
  neonOn?: boolean;
}

export default function NeonText({
  text,
  color = '#ffffff',
  position = [0, 0, 0.02],
  scale = 1,
  isNumber = false,
  curve = false,
  neonOn = true,
}: NeonTextProps) {
  const texture = useMemo(() => {
    if (!text) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const width = isNumber ? 1024 : 1800;
    const height = isNumber ? 600 : 480;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const fontSize = isNumber
      ? text.length === 1
        ? 380
        : 300
      : text.length <= 5
        ? 170
        : text.length <= 8
          ? 145
          : 120;

    ctx.font = `900 ${fontSize}px "Arial Black", "Impact", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Soft glow only when neon is on
    if (neonOn) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;

    if (curve && !isNumber) {
      const centerX = width / 2;
      const centerY = height / 2 + 8;
      const characters = text.toUpperCase().split('');
      const len = characters.length;

      let spacingFactor: number;
      let radius: number;

      if (len <= 5) {
        spacingFactor = 0.11;
        radius = 1100;
      } else if (len <= 8) {
        spacingFactor = 0.115;
        radius = 1150;
      } else if (len <= 11) {
        spacingFactor = 0.08;
        radius = 970;
      } else {
        spacingFactor = 0.068;
        radius = 950;
      }

      const totalAngle = Math.min(len * spacingFactor, 1.05);
      const startAngle = -totalAngle / 2;

      characters.forEach((char, i) => {
        const t = len === 1 ? 0.5 : i / (len - 1);
        const angle = startAngle + t * totalAngle;

        const x = centerX + Math.sin(angle) * radius;
        const y = centerY - Math.cos(angle) * (radius * 0.11);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * 0.4);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      });
    } else {
      ctx.fillText(text.toUpperCase(), width / 2, height / 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [text, color, isNumber, curve, text.length, neonOn]);

  if (!texture || !text) return null;

  const planeWidth = isNumber
    ? text.length === 1
      ? 0.38
      : 0.65
    : Math.min(0.62 + text.length * 0.038, 1.15);

  const planeHeight = isNumber ? 0.37 : 0.26;

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={false}
        opacity={neonOn ? 0.95 : 0.75}
      />
    </mesh>
  );
}