'use client';

import { useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';

type Props = {
  onReady: (takeSnapshot: () => Promise<string | null>) => void;
};

export default function SnapshotController({ onReady }: Props) {
  const { gl, scene, camera } = useThree();

  const takeSnapshot = useCallback(async () => {
    try {
      gl.render(scene, camera);
      return gl.domElement.toDataURL('image/png', 1.0);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [gl, scene, camera]);

  useEffect(() => {
    onReady(takeSnapshot);
    (window as any).__takeJerseySnapshot = takeSnapshot;
    return () => {
      delete (window as any).__takeJerseySnapshot;
    };
  }, [onReady, takeSnapshot]);

  return null;
}