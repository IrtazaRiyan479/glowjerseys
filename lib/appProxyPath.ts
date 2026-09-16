/**
 * Builds a path to one of this app's own API routes that stays under
 * whatever prefix the current page was actually loaded at. When loaded
 * through the Shopify App Proxy, the page lives at
 * `/apps/<subpath>/...` on the shop's domain — a hardcoded leading-slash
 * fetch (e.g. `/api/foo`) would resolve to the shop's own root instead,
 * outside the proxied path, and 404 before ever reaching this app.
 * /cart.js is unaffected by this — that's always at the true site root.
 */
export function getAppApiPath(path: string): string {
  if (typeof window === 'undefined') return path;
  const prefix = window.location.pathname.replace(/\/$/, '');
  return `${prefix}${path.startsWith('/') ? path : `/${path}`}`;
}
