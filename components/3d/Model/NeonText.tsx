'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NeonTextProps {
  text: string;
  color?: string;
  position?: [number, number, number];
  scale?: number;
  isNumber?: boolean;
  curve?: boolean;
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
  
  // 1. Wait for local fonts to load before drawing the canvas
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setFontLoaded(true));
  }, []);

  // 2. Generate the Canvas Alpha Mask
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
      ? text.length === 1 ? 380 : 300
      : text.length <= 5 ? 170 : text.length <= 8 ? 145 : 120;

    // Font will successfully apply because of the fontLoaded state trigger
    ctx.font = `normal ${fontSize}px "Chaniago", "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Assign both stroke and fill styles
    ctx.lineWidth = isNumber ? 12 : 8; 
    ctx.strokeStyle = '#ffffff'; 
    ctx.fillStyle = '#ffffff'; 

    if (curve && !isNumber) {
      const centerX = width / 2;
      const centerY = height / 2 + 8;
      const characters = text.toUpperCase().split('');
      const len = characters.length;

      let spacingFactor: number;
      let radius: number;

      if (len <= 5) {
        spacingFactor = 0.11; radius = 1100;
      } else if (len <= 8) {
        spacingFactor = 0.115; radius = 1150;
      } else if (len <= 11) {
        spacingFactor = 0.08; radius = 970;
      } else {
        spacingFactor = 0.068; radius = 950;
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
        // CHANGED: Use fillText for solid normal text instead of strokeText
        ctx.fillText(char, 0, 0); 
        ctx.restore();
      });
    } else {
      if (isNumber) {
        ctx.strokeText(text.toUpperCase(), width / 2, height / 2); // Outlined Number
      } else {
        ctx.fillText(text.toUpperCase(), width / 2, height / 2);   // Solid Straight Text
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [text, isNumber, curve, text.length, fontLoaded]); // re-runs when font is ready

  // 3. Setup Shader Material Logic
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // CHANGED: Solid text emits massively more light than outlines. Drop intensity from 8.0 to 2.5 for text to stop the blurry camera blowout.
  const activeIntensity = neonOn ? (isNumber ? 8.0 : 2.5) : 0.6;

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uIntensity.value = activeIntensity;
      materialRef.current.uniforms.uColor1.value.set(color);
      materialRef.current.uniforms.uColor2.value.set(color);
    }
  });

  if (!texture || !text) return null;

  const planeWidth = isNumber
    ? text.length === 1 ? 0.38 : 0.65
    : Math.min(0.62 + text.length * 0.038, 1.15);

  const planeHeight = isNumber ? 0.37 : 0.26;

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;
    uniform float uIntensity;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      if (texColor.a < 0.1) discard; 

      float wave = sin(vPosition.y * 10.0 + uTime * 2.5) * 0.5 + 0.5;
      float pulse = pow(abs(sin(uTime * 1.5)), 2.0) * 0.3 + 0.7;
      
      vec3 finalColor = mix(uColor1, uColor2, wave) * pulse * uIntensity;
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `;

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color) },
          uColor2: { value: new THREE.Color(color) },
          uIntensity: { value: activeIntensity },
          uTexture: { value: texture }
        }}
        transparent={true}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}