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
  // Needed alongside assetPrefix: once static assets load from a different
  // origin than the page (e.g. the shop's domain via the App Proxy loading
  // JS/CSS from this app's own origin), the browser enforces CORS on those
  // cross-origin requests. These are public, non-sensitive build assets, so
  // allowing any origin is standard practice here.
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
};

export default nextConfig;