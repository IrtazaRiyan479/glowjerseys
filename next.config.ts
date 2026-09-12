import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'postprocessing', '@react-three/postprocessing'],
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei', '@react-three/fiber', 'postprocessing'],
  },
};

export default nextConfig;