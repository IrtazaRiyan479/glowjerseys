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
  textureVariant?: 1 | 2; 
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
  textureVariant = 1, 
}: ModelProps) => {
 const { scene } = useGLTF(glbUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene, glbUrl]);

  
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
          // float pulse = pow(abs(sin(uTime * 1.5)), 2.0) * 0.3 + 0.7;
          float pulse = 1.0;
        
          float distanceFactor = 1.0 - smoothstep(0.0, 0.5, vDistanceToMouse);
        
          vec3 color = mix(uColor1, uColor2, wave) * pulse * uIntensity * (1.0 + distanceFactor * 0.3);
          gl_FragColor = vec4(color, 1.0);
      }
  `;

  
  const neonMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  
  useFrame((_, delta) => {
    if (neonMaterialRef.current) {
      neonMaterialRef.current.uniforms.uTime.value += delta;
    }
  });

  
  useEffect(() => {
    [c1, n1, c2, n2].forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
     tex.repeat.set(3, 2);   
tex.anisotropy = 2;     
tex.generateMipmaps = true;
tex.minFilter = THREE.LinearMipmapLinearFilter;
    });
    c1.colorSpace = c2.colorSpace = THREE.SRGBColorSpace;
    n1.colorSpace = n2.colorSpace = THREE.LinearSRGBColorSpace;
  }, [c1, n1, c2, n2]);

  
  const activeColorMap = textureVariant === 1 ? c1 : c2;
  const activeNormalMap = textureVariant === 1 ? n1 : n2;

 useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const nameLower = child.name.toLowerCase();

      
  if (nameLower.includes('plane')) {
  const isTex2 = textureVariant === 2;

  child.material = new THREE.MeshStandardMaterial({
    map: activeColorMap,
    normalMap: activeNormalMap,
    normalScale: new THREE.Vector2(0.12, 0.12),
    roughness: isTex2 ? 0.65 : 0.85,
    metalness: isTex2 ? 0.08 : 0.05,
    color: isTex2
      ? (isDark ? '#c8c8c8' : '#ffffff')
      : (isDark ? '#888888' : '#ffffff'),
    emissive: new THREE.Color('#000000'),
    emissiveIntensity: 0,
  });
  child.material.needsUpdate = true;
}
      
     
else if (nameLower.includes('neon')) { 
  child.geometry.computeVertexNormals();
  if (!neonOn) {
    
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
    const softColors = [
      '#FFE800', '#FBECCB', '#ffffff', '#ffff00', '#fff700',
      '#ffee00', '#f5e6a3', '#f0e68c', '#fffacd', '#fff8dc'
    ];
    const isSoft = softColors.includes(outlineColor.toLowerCase());
    const intensity = isSoft ? 1.2 : 5.0;

    if (!neonMaterialRef.current) {
      neonMaterialRef.current = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(outlineColor) },
          uColor2: { value: new THREE.Color(outlineColor) },
          uIntensity: { value: intensity },
          uMouseWorld: { value: new THREE.Vector3(999, 999, 999) }, 
        },
        transparent: false,
        toneMapped: false,
        depthWrite: true,
        depthTest: true,
      });
    } else {
      neonMaterialRef.current.uniforms.uColor1.value.set(outlineColor);
      neonMaterialRef.current.uniforms.uColor2.value.set(outlineColor);
      neonMaterialRef.current.uniforms.uIntensity.value = intensity;
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

    
else {
  const isInnerMesh =
    nameLower.includes('jersey');

  const isClear =
    backboardColor === 'transparent' ||
    backboardColor === 'Transparent';

  child.geometry.computeVertexNormals();

  const clearAcrylicMaterial = new THREE.MeshPhysicalMaterial({
  color: '#e8eef5',
  metalness: 0.0,
  roughness: 0.015,
  transmission: 0.97,
  ior: 1.5,
  thickness: 0.025,
  attenuationDistance: 0.8,
  attenuationColor: new THREE.Color('#dce6f0'),
  clearcoat: 1.0,
  clearcoatRoughness: 0.008,
  envMapIntensity: 2.8,
  transparent: true,
  opacity: 1.0,
  side: THREE.DoubleSide,
  depthWrite: false,
  alphaToCoverage: true,
  specularIntensity: 1.0,
  reflectivity: 0.5,
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

  
  if (isInnerMesh && !isClear) {
    child.material = solidColorMaterial;
  } else {
    child.material = clearAcrylicMaterial;
  }

  child.material.needsUpdate = true;
}
    });
  }, [clonedScene, outlineColor, backboardColor, neonOn, isDark, activeColorMap, activeNormalMap, textureVariant]);

const isTex2 = textureVariant === 2;

const bounceLights = neonOn
  ? [
      [0, 0.15, -0.05],
      [-0.15, 0.05, -0.05],
      [0.15, 0.05, -0.05],
      [0, -0.12, -0.05],
    ]
  : [];

const bounceIntensity = isTex2 ? 4.2 : 1.4;

  return (
    <group position={[0, -0.05, 0]} scale={1.15}>
      <primitive object={clonedScene} />

      {neonOn && (
        <group>
          {bounceLights.map((pos, index) => (
       <pointLight
  key={`bounce-${index}`}
  position={new THREE.Vector3(...pos)}
  color={outlineColor}
  intensity={bounceIntensity}
  distance={isTex2 ? 0.45 : 0.6}
  decay={2}
  castShadow={false}
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

useGLTF.preload('/3d/models/Basketball.glb');

export default Model;