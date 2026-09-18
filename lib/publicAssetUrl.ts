/**
 * Prefixes a public/ asset path (3D models, textures, fonts) with the app's
 * own absolute URL when loaded through the Shopify App Proxy. Next's
 * `assetPrefix` only rewrites /_next/static/* automatically — files served
 * straight from public/ are referenced as plain root-relative paths in the
 * 3D components, which would otherwise resolve against the shop's domain
 * (outside the proxied path) and 404, the same class of bug fixed earlier
 * for this app's own API route. See next.config.ts for where this value
 * comes from.
 */
export function publicAssetUrl(path: string): string {
  const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}
