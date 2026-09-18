import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "postprocessing", "@react-three/postprocessing"],
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/drei",
      "@react-three/fiber",
      "postprocessing",
    ],
  },
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  env: {
    NEXT_PUBLIC_ASSET_PREFIX: process.env.ASSET_PREFIX || "",
  },
  async headers() {
    const corsHeader = [{ key: "Access-Control-Allow-Origin", value: "*" }];
    return [
      { source: "/_next/static/:path*", headers: corsHeader },
      { source: "/3d/:path*", headers: corsHeader },
      { source: "/textures/:path*", headers: corsHeader },
      { source: "/fonts/:path*", headers: corsHeader },
    ];
  },
};

export default nextConfig;
