'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';

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

export default function NeonText({
  text,
  color = '#ffffff',
  position = [0, 0, 0.02],
  scale = 1,
  isNumber = false,
  curve = false,
  neonOn = true,
  sport = 'Soccer',
}: NeonTextProps) {
  const softColors = ['#ffe800', '#fbeccb', '#ffffff'];
  const isSoft = softColors.includes(color.toLowerCase());
  const activeIntensity = neonOn ? (isSoft ? 6.5 : 12.0) : 0.35;

  
  
  const getTextSize = () => {
    if (isNumber) {
      
      return sport === 'Basketball' ? 0.22 : 0.28;
    }

    
    if (sport === 'Basketball') {
      if (text.length <= 5) return 0.145;
      if (text.length <= 8) return 0.125;
      return 0.105;
    }

    
    if (text.length <= 5) return 0.17;
    if (text.length <= 8) return 0.155;
    return 0.135;
  };

  const textSize = getTextSize();
  const extrusionDepth = isNumber ? 0.25 : 0.092;

  
  const vertexShader = `
    uniform vec3 uMouseWorld;
    varying float vDistanceToMouse;

    void main() {
      vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vDistanceToMouse = distance(worldPosition, uMouseWorld);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform float uIntensity;
    varying float vDistanceToMouse;

    void main() {
      float distanceFactor = 1.0 - smoothstep(0.0, 0.5, vDistanceToMouse);
      vec3 color = uColor1 * uIntensity * (1.0 + distanceFactor * 0.3);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const neonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color) },
        uIntensity: { value: activeIntensity },
        uMouseWorld: { value: new THREE.Vector3(999, 999, 999) },
      },
      transparent: true,
      toneMapped: false,
      depthWrite: false,
    });
  }, [color, activeIntensity]);

  const physicalMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: isSoft ? 0.2 : 0.35,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      depthWrite: false,
    });
  }, [color, isSoft]);

  useFrame((_, delta) => {
    if (neonMaterial.uniforms) {
      neonMaterial.uniforms.uTime.value += delta;
      neonMaterial.uniforms.uIntensity.value = activeIntensity;
      neonMaterial.uniforms.uColor1.value.set(color);
    }
  });

  if (!text) return null;

  
  const renderCurvedText = () => {
    const characters = text.toUpperCase().split('');
    const len = characters.length;

    
    let spacingFactor: number;
    let radius: number;

    if (len <= 5) {
      spacingFactor = 0.10;
      radius = 1.05;          
    } else if (len <= 8) {
      spacingFactor = 0.10;
      radius = 0.82;          
    } else if (len <= 11) {
      spacingFactor = 0.08;
      radius = 0.68;          
    } else {
      spacingFactor = 0.09;
      radius = 0.58;          
    }

    const totalAngle = Math.min(len * spacingFactor, 1.05);
    const startAngle = -totalAngle / 2;

    return characters.map((char, i) => {
      const t = len === 1 ? 0.5 : i / (len - 1);
      const angle = startAngle + t * totalAngle;

      const x = Math.sin(angle) * radius;
      const y = -Math.cos(angle) * (radius * 0.11);
      const rotationZ = -angle * 0.4;

      return (
        <group
          key={i}
          position={[x, y + radius * 0.11, 0]}
          rotation={[0, 0, rotationZ]}
        >
          <Center>
            <Text3D
              font="/fonts/Bondtique.json"
              size={textSize * 0.92}
              height={extrusionDepth}
              curveSegments={12}
              bevelEnabled={true}
              bevelThickness={0.007}
              bevelSize={0.0035}
              bevelSegments={4}
              
              material={neonOn ? neonMaterial : physicalMaterial}
            >
              {char}
            </Text3D>
          </Center>
        </group>
      );
    });
  };

  
  const renderFlatText = () => {
    return (
      <Center>
        <Text3D
          font="/fonts/Bondtique.json"
          size={textSize}
          height={extrusionDepth}
          curveSegments={12}
          bevelEnabled={true}
          bevelThickness={isNumber ? 0.009 : 0.007}
          bevelSize={isNumber ? 0.0045 : 0.0035}
          bevelSegments={4}
          letterSpacing={isNumber ? 0 : 0.025}   
          material={neonOn ? neonMaterial : physicalMaterial}
        >
          {text.toUpperCase()}
        </Text3D>
      </Center>
    );
  };

  return (
    <group position={position} scale={scale}>
      {curve && !isNumber ? renderCurvedText() : renderFlatText()}
    </group>
  );
}