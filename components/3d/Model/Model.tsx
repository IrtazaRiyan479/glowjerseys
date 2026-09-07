'use client';

import { useGLTF } from '@react-three/drei';
import React, { useEffect, useMemo } from 'react';
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
  /** When false, neon outline and text glow are turned off */
  neonOn?: boolean;
}

const Model = ({
  glbUrl,
  outlineColor = '#00ff66',
  backboardColor = 'transparent',
  name = '',
  number = '',
  nameColor = '#ffffff',
  numberColor = '#ffffff',
  neonOn = true,
}: ModelProps) => {
  const { scene } = useGLTF(glbUrl);

  // Clone so we don't mutate the cached original
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const nameLower = child.name.toLowerCase();

      // ===== BACKBOARD =====
      if (nameLower.includes('plane')) {
        const isClear = backboardColor === 'transparent';
        const mat = new THREE.MeshPhysicalMaterial({
          color: isClear ? '#ffffff' : backboardColor,
          transparent: true,
          // Dropped opacity slightly so it doesn't trap light
          opacity: isClear ? 0.8 : 1, 
          transmission: isClear ? 0.95 : 0, 
          // FIX: Changed roughness to 0.0 for perfectly smooth glass to stop light scatter
          roughness: 0.0, 
          metalness: 0,
          ior: 1.0, 
          side: THREE.FrontSide,
        });
        child.material = mat;
      }

    // ===== NEON OUTLINE =====
      if (nameLower.includes('vert')) {
        const mat = new THREE.MeshPhysicalMaterial({
          color: neonOn ? '#ffffff' : outlineColor,
          emissive: neonOn ? outlineColor : '#000000',
          emissiveIntensity: neonOn ? 2.5 : 0,
          roughness: neonOn ? 0.1 : 0.4,
          metalness: 0,
          transmission: 0,
          ior: 1.5,
          thickness: 0,
          transparent: false,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          toneMapped: !neonOn,
          side: THREE.FrontSide,
        });
        child.material = mat;
      }
    });
  }, [clonedScene, outlineColor, backboardColor, neonOn]);

  return (
    <group position={[0, -0.05, 0]} scale={1.15}>
      <primitive object={clonedScene} />

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

useGLTF.preload('/3d/models/glowjerseys.glb');

export default Model;