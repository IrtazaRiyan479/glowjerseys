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
  
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setFontLoaded(true));
  }, []);

 const texture = useMemo(() => {
    if (!text) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const width = isNumber ? 1024 : 1800;
    const height = isNumber ? 600 : 480;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // CHANGED: Increased font sizes overall
    const fontSize = isNumber
      ? text.length === 1 ? 300 : 300
      : text.length <= 5 ? 170 : text.length <= 8 ? 180 : 140;

    // CHANGED: Added 'bold' to the font string
    ctx.font = `bold ${fontSize}px "Bondtique", "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // CHANGED: Added native letter spacing for straight text
    ctx.letterSpacing = isNumber ? '0px' : '20px';

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // CHANGED: Thicker line width for the hollow numbers
    ctx.lineWidth = isNumber ? 12 : 5; 
    ctx.strokeStyle = '#ffffff'; 
    ctx.fillStyle = '#ffffff';   
    ctx.lineCap = 'round';   
    ctx.lineJoin = 'round';  

    if (curve && !isNumber) {
      const centerX = width / 2;
      const centerY = height / 2 + 55;
      const characters = text.toUpperCase().split('');
      const len = characters.length;

      let spacingFactor: number;
      let radius: number;

      if (len <= 5) {
        spacingFactor = 0.10; radius = 1100;
      } else if (len <= 8) {
        spacingFactor = 0.10; radius = 850;
      } else if (len <= 11) {
        spacingFactor = 0.08; radius = 700;
      } else {
        spacingFactor = 0.9; radius = 600;
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
      if (isNumber) {
        ctx.strokeText(text.toUpperCase(), width / 2, height / 2); 
      } else {
        ctx.fillText(text.toUpperCase(), width / 2, height / 2);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [text, isNumber, curve, text.length, fontLoaded]);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Synced exactly to Model_14.tsx outline intensity
  const activeIntensity = 19.0; 

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
    ? text.length === 1 ? 0.45 : 0.75
    : Math.min(0.75 + text.length * 0.05, 1.4);

  const planeHeight = isNumber ? 0.45 : 0.35;

 const vertexShader = `
    uniform vec3 uMouseWorld;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistanceToMouse;

    void main() {
      vUv = uv;
      vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vDistanceToMouse = distance(worldPosition, uMouseWorld);
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
    varying float vDistanceToMouse;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      if (texColor.a < 0.1) discard; 
      float distanceFactor = 1.0 - smoothstep(0.0, 0.5, vDistanceToMouse);

      vec3 color = uColor1 * uIntensity * (1.0 + distanceFactor * 0.3);
      
      gl_FragColor = vec4(color, texColor.a);
    }
  `;

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      
      {/* Conditionally switch materials identical to Model.tsx logic */}
      {neonOn ? (
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
         uniforms={{
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(color) },
            uColor2: { value: new THREE.Color(color) },
            uIntensity: { value: activeIntensity },
            uTexture: { value: texture },
            uMouseWorld: { value: new THREE.Vector3(999, 999, 999) }
          }}
          transparent={true}
          toneMapped={false}
          depthWrite={false}
        />
      ) : (
        <meshPhysicalMaterial
          map={texture}
          color={color}
          emissive={color}
          emissiveIntensity={0.35} 
          roughness={0.25}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent={true}
          alphaTest={0.1}  // Discards the transparent background of the canvas
          depthWrite={false}
        />
      )}
    </mesh>
  );
}