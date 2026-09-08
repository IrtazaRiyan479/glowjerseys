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
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Load ALL textures upfront
  const [c1, n1, c2, n2] = useLoader(THREE.TextureLoader, [
    '/textures/wall/BrickWall01.jpg',
    '/textures/wall/BrickWall01_Normal.jpg',
    '/textures/wall/BrickWall02.jpg',
    '/textures/wall/BrickWall02_Normal.jpg',
  ]);

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

     // ===== 4. THE BACKBOARD (Catch-all for the main shirt body) =====
      else { 
        const isInnerMesh = nameLower.includes('jersey');
        const isClear = backboardColor === 'transparent';

        // Always perfectly clear for the outer acrylic and for transparent mode
        const clearAcrylicMaterial = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.0,
          roughness: 0.0,
          transmission: 1.0,       
          ior: 1.45,               
          thickness: 0.02,         
          attenuationDistance: 2.0, 
          attenuationColor: new THREE.Color('#ffffff'), 
          clearcoat: 1.0,          
          clearcoatRoughness: 0.0, 
          envMapIntensity: 2.0,    
          transparent: true,
          opacity: 1.0,          
          side: THREE.DoubleSide,
        });

        // Solid, glossy plastic look for the inner backboard color
   const solidColorMaterial = new THREE.MeshPhysicalMaterial({
  color: backboardColor,
  metalness: 0.02,
  roughness: 0.12,
  transmission: 0.0,        // fully blocks the wall
  thickness: 0.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
  envMapIntensity: 1.2,     // still gets environment reflections
  transparent: false,
  opacity: 1.0,
  side: THREE.DoubleSide,
});

        // Apply the solid color strictly to the inner mesh when a color is selected
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