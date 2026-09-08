'use client';

import { useGLTF } from '@react-three/drei';
import { useLoader, useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import NeonText from './NeonText';

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
  textureVariant?: 1 | 2; // Add this line
}

const Model = ({
  glbUrl,
  outlineColor = '#ff3300',
  backboardColor = 'transparent',
  name = '',
  number = '',
  nameColor = '#ffffff',
  numberColor = '#ffffff',
  neonOn = true,
  isDark = true,
  textureVariant = 1, // Add this line
}: ModelProps) => {
 const { scene } = useGLTF(glbUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene, glbUrl]);

  // Load ALL textures upfront
  const [c1, n1, c2, n2] = useLoader(THREE.TextureLoader, [
    '/textures/wall/BrickWall01.jpg',
    '/textures/wall/BrickWall01_Normal.jpg',
    '/textures/wall/BrickWall02.jpg',
    '/textures/wall/BrickWall02_Normal.jpg',
  ]);

  const sport =
  glbUrl.includes('Basketball') ? 'Basketball' :
  glbUrl.includes('BaseBall') || glbUrl.includes('Baseball') ? 'Baseball' :
  glbUrl.includes('Football') ? 'Football' :
  glbUrl.includes('Hockey') ? 'Hockey' :
  'Soccer';

  // Exact shaders from reference project
  const vertexShader = `
      uniform vec3 uMouseWorld;
      uniform float uTime;
      
      varying vec3 vPosition;
      varying float vDistanceToMouse;
  
      void main() {
          vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          float distanceToMouse = distance(worldPosition, uMouseWorld);
        
          float falloff = 1.0 - smoothstep(0.0, 0.7, distanceToMouse);
          falloff = pow(falloff, 2.0);
        
          vec3 deformDirection = normalize(worldPosition - uMouseWorld);
          
          // MINIMAL CHANGE: Commented out deformation to prevent mouse movement control
          // vec3 newPosition = position + deformDirection * sin(distanceToMouse * 10.0 - uTime * 3.0) *  0.1 * falloff * 0.5;
          vec3 newPosition = position; 
  
          vPosition = newPosition;
          vDistanceToMouse = distanceToMouse;
        
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
  `;

  const fragmentShader = `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uTime;
      uniform float uIntensity;
  
      varying vec3 vPosition;
      varying float vDistanceToMouse;
  
      void main() {
          float wave = sin(vPosition.y * 3.0 + uTime * 2.5) * 0.5 + 0.5;
          float pulse = pow(abs(sin(uTime * 1.5)), 2.0) * 0.3 + 0.7;
        
          float distanceFactor = 1.0 - smoothstep(0.0, 0.5, vDistanceToMouse);
        
          vec3 color = mix(uColor1, uColor2, wave) * pulse * uIntensity * (1.0 + distanceFactor * 0.3);
          gl_FragColor = vec4(color, 1.0);
      }
  `;

  // Ref to hold and update the shader material
  const neonMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Run the pulsing time logic from reference project
  useFrame((_, delta) => {
    if (neonMaterialRef.current) {
      neonMaterialRef.current.uniforms.uTime.value += delta;
    }
  });

  // Configure textures
  useEffect(() => {
    [c1, n1, c2, n2].forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
     tex.repeat.set(3, 2);   // was 4,3 — less GPU work
tex.anisotropy = 2;     // was 4
tex.generateMipmaps = true;
tex.minFilter = THREE.LinearMipmapLinearFilter;
    });
    c1.colorSpace = c2.colorSpace = THREE.SRGBColorSpace;
    n1.colorSpace = n2.colorSpace = THREE.LinearSRGBColorSpace;
  }, [c1, n1, c2, n2]);

  // Dynamically select the active textures based on state
  const activeColorMap = textureVariant === 1 ? c1 : c2;
  const activeNormalMap = textureVariant === 1 ? n1 : n2;

 useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const nameLower = child.name.toLowerCase();

      // ===== 1. GLB WALL TEXTURE =====
      if (nameLower.includes('plane')) { 
        child.material = new THREE.MeshStandardMaterial({
          map: activeColorMap,          
          normalMap: activeNormalMap,   
          normalScale: new THREE.Vector2(0.1, 0.1),
          roughness: 0.85,
          metalness: 0.05,
          color: isDark ? '#888888' : '#ffffff',
        });
        child.material.needsUpdate = true;
      }
      
     // ===== 2. NEON OUTLINE =====
else if (nameLower.includes('neon')) { 
  if (!neonOn) {
    // When OFF: Vibrant physical silicone/plastic tube that stays visible in the dark
    child.material = new THREE.MeshPhysicalMaterial({
      color: outlineColor,
      emissive: new THREE.Color(outlineColor),
      emissiveIntensity: 0.35, 
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 1.0,         
      clearcoatRoughness: 0.1,
      transparent: false,
    });
  } else {
    // When ON: ShaderMaterial
    if (!neonMaterialRef.current) {
      neonMaterialRef.current = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(outlineColor) },
          uColor2: { value: new THREE.Color(outlineColor) },
          uIntensity: { value: 8.0 },
          uMouseWorld: { value: new THREE.Vector3(999, 999, 999) }, 
        },
        transparent: true,
        toneMapped: false, 
      });
    } else {
      neonMaterialRef.current.uniforms.uColor1.value.set(outlineColor);
      neonMaterialRef.current.uniforms.uColor2.value.set(outlineColor);
      neonMaterialRef.current.uniforms.uIntensity.value = 8.0;
    }
    
    child.material = neonMaterialRef.current;
  }
  child.material.needsUpdate = true;
}

      // ===== 3. HARDWARE (Chains, Wires, Cords) =====
      else if (nameLower.includes('chain') || nameLower.includes('wire') || nameLower.includes('cord') || nameLower.includes('cable')) {
        // Prevents the hanging chain and bottom cord from turning into glass
        const isChain = nameLower.includes('chain');
        child.material = new THREE.MeshStandardMaterial({
          color: isChain ? '#888888' : '#e0e0e0', // Darker for chains, lighter for power cord
          metalness: isChain ? 0.8 : 0.1,
          roughness: isChain ? 0.4 : 0.8,
        });
        child.material.needsUpdate = true;
      }

    // ===== 4. THE BACKBOARD =====
else {
  const isInnerMesh =
    nameLower.includes('jersey');

  const isClear =
    backboardColor === 'transparent' ||
    backboardColor === 'Transparent';

  const clearAcrylicMaterial = new THREE.MeshPhysicalMaterial({
  color: '#e8eef5',           // slight cool tint (real acrylic isn’t pure white)
  metalness: 0.0,
  roughness: 0.08,            // tiny micro-surface so it catches light
  transmission: 0.98,         // still very clear, but not invisible
  ior: 1.49,                  // acrylic IOR (~1.49), not water
  thickness: 0.04,            // thicker = more visible edges / volume
  attenuationDistance: 0.6,   // light fades a bit through the plate
  attenuationColor: new THREE.Color('#dce6f0'), // soft blue-grey falloff
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,   // glossy top surface
  envMapIntensity: 2.5,       // stronger room reflections on the face
  transparent: true,
  opacity: 1.0,
  side: THREE.DoubleSide,
  depthWrite: false,          // avoids sorting glitches with neon/text
});

  const solidColorMaterial = new THREE.MeshPhysicalMaterial({
    color: backboardColor,
    metalness: 0.0,
    roughness: 0.05,
    transmission: 0.0,
    thickness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 2.0,
    reflectivity: 0.9,
    transparent: false,
    opacity: 1.0,
    side: THREE.DoubleSide,
  });

  // Outer shell stays clear; inner jersey/glass plate gets the solid color
  if (isInnerMesh && !isClear) {
    child.material = solidColorMaterial;
  } else {
    child.material = clearAcrylicMaterial;
  }

  child.material.needsUpdate = true;
}
    });
  }, [clonedScene, outlineColor, backboardColor, neonOn, isDark, activeColorMap, activeNormalMap]);

  // Strategically placed physical lights to follow the shirt silhouette
  // Format: [x, y, z] - The Z is slightly negative to push the light behind the backboard
const bounceLights = neonOn
  ? [
      [0, 0.15, -0.05],
      [-0.15, 0.05, -0.05],
      [0.15, 0.05, -0.05],
      [0, -0.12, -0.05],
    ]
  : [];

  const dynamicBounceIntensity = backboardColor === 'transparent' ? 0.3 : 1.5;

  return (
    <group position={[0, -0.05, 0]} scale={1.15}>
      <primitive object={clonedScene} />

      {/* The Physical Light Rig for Wall & Chain Reflections */}
      {neonOn && (
        <group>
          {bounceLights.map((pos, index) => (
            <pointLight
              key={`bounce-${index}`}
              position={new THREE.Vector3(...pos)}
              color={outlineColor}
              intensity={dynamicBounceIntensity}
              distance={0.6}  // Prevents light from spilling across the whole room
              decay={2}       // Physically accurate inverse-square falloff
              castShadow={false} // Kept false to allow light to pass through the glass backboard smoothly
            />
          ))}
        </group>
      )}

      {name && (
        <NeonText
          text={name}
          color={nameColor}
          position={[0, 0.09, 0.02]}
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
          position={[0, -0.13, 0.02]}
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

useGLTF.preload('/3d/models/BlueSoccer.glb');
useGLTF.preload('/3d/models/BaseBall.glb');
useGLTF.preload('/3d/models/Basketball.glb');
useGLTF.preload('/3d/models/Football.glb');
useGLTF.preload('/3d/models/Hockey.glb');

export default Model;