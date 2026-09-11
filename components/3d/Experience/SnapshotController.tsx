'use client';

import { useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';

type Props = {
  onReady: (takeSnapshot: () => Promise<string | null>) => void;
};

export default function SnapshotController({ onReady }: Props) {
  const { gl } = useThree();

  const takeSnapshot = useCallback(async () => {
  try {
    const src = gl.domElement;
    const max = 280;
    const scale = Math.min(max / src.width, max / src.height, 1);
    const w = Math.max(1, Math.round(src.width * scale));
    const h = Math.max(1, Math.round(src.height * scale));

    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const ctx = off.getContext('2d');
    if (!ctx) return src.toDataURL('image/jpeg', 0.7);

    ctx.drawImage(src, 0, 0, w, h);
    return off.toDataURL('image/jpeg', 0.7);
  } catch (e) {
    console.error(e);
    return null;
  }
}, [gl]);

  useEffect(() => {
    onReady(takeSnapshot);
    (window as any).__takeJerseySnapshot = takeSnapshot;
    return () => {
      delete (window as any).__takeJerseySnapshot;
    };
  }, [onReady, takeSnapshot]);

  return null;
}