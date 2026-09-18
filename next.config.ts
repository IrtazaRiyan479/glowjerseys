import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'postprocessing', '@react-three/postprocessing'],
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei', '@react-three/fiber', 'postprocessing'],
  },
  // When set, static assets (/_next/static/*) load from this absolute URL
  // instead of a relative path. Needed when the app is loaded through the
  // Shopify App Proxy: the page itself is served at
  // https://<shop>/apps/<subpath>/, but asset requests must bypass the proxy
  // (Shopify only forwards paths under /apps/<subpath>/*) and go straight to
  // wherever this app is actually hosted (a tunnel URL locally, or the real
  // deployment once it exists). Leave unset for plain standalone hosting.
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  // Exposes the same value to client code as NEXT_PUBLIC_ASSET_PREFIX —
  // assetPrefix itself only rewrites /_next/static/* requests, not files
  // served from public/ (3D models, textures, fonts), which are referenced
  // as plain root-relative paths in the 3D components. Those need this to
  // build the same absolute-URL prefixing by hand. See lib/publicAssetUrl.ts.
  env: {
    NEXT_PUBLIC_ASSET_PREFIX: process.env.ASSET_PREFIX || '',
  },
  // Needed alongside assetPrefix: once static assets load from a different
  // origin than the page (e.g. the shop's domain via the App Proxy loading
  // JS/CSS from this app's own origin), the browser enforces CORS on those
  // cross-origin requests. These are public, non-sensitive build assets, so
  // allowing any origin is standard practice here. Covers both /_next/static
  // and public/ (3D models, textures, fonts), same reasoning as above.
  async headers() {
    const corsHeader = [{ key: 'Access-Control-Allow-Origin', value: '*' }];
    return [
      { source: '/_next/static/:path*', headers: corsHeader },
      { source: '/3d/:path*', headers: corsHeader },
      { source: '/textures/:path*', headers: corsHeader },
      { source: '/fonts/:path*', headers: corsHeader },
    ];
  },
};

export default nextConfig;