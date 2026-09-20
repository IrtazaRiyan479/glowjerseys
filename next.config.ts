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
    // Default 1mb cap rejects the jersey preview snapshot and review photo
    // uploads (both base64 data URLs sent to the uploadImage server action).
    serverActions: { bodySizeLimit: "10mb" },
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
      { source: "/api/:path*", headers: corsHeader },
    ];
  },
};

export default nextConfig;
