export const jerseyColors = [
  { name: 'Yellow', hex: '#FFE800' },
  { name: 'Orange', hex: '#FF8A00' },
  { name: 'Ice Blue', hex: '#2CC5F5' },
  { name: 'Green', hex: '#17D63A' },
  { name: 'Red', hex: '#FF1A15' },
  { name: 'Blue', hex: '#0A46FF' },
  { name: 'Purple', hex: '#8A16FF' },
  { name: 'Pink', hex: '#FF2E9A' },
    { name: 'Neutral White', hex: '#E8C07A' },
  { name: 'White', hex: '#FFFFFF' },
] as const;

import { publicAssetUrl } from '@/lib/publicAssetUrl';

export const SPORTS = ['Baseball', 'Basketball', 'Football', 'Soccer', 'Hockey'] as const;

export const SPORT_MODELS: Record<string, string> = {
  Baseball: publicAssetUrl('/3d/models/BaseBall.glb'),
  Basketball: publicAssetUrl('/3d/models/Basketball.glb'),
  Football: publicAssetUrl('/3d/models/Football.glb'),
  Soccer: publicAssetUrl('/3d/models/BlueSoccer.glb'),
  Hockey: publicAssetUrl('/3d/models/Hockey.glb'),
};

// Real variant IDs/prices from the mk-enterprises-x35r23fp.myshopify.com demo store.
export const SIZE_OPTIONS = [
  { value: 20, unit: 'inch', variantId: 'gid://shopify/ProductVariant/48359110443244', price: 164.99 },
  { value: 30, unit: 'inch', variantId: 'gid://shopify/ProductVariant/48359110476012', price: 299.99 },
] as const;

export const PRODUCT = {
  slug: 'custom-glow-jersey',
  name: 'Custom Glow Jersey',
  currency: 'USD',
};

export type JerseySelectedOptions = {
  size: number;
  sport: string;
  name: string;
  number: string;
  jerseyColor: string;
  nameColor: string;
  numberColor: string;
  backboardColor: string;
  previewImageUrl?: string;
};

export function toShopifyProperties(opts: JerseySelectedOptions) {
  return [
    { key: 'Size', value: `${opts.size} in` },
    { key: 'Sport', value: opts.sport },
    { key: 'Name', value: opts.name },
    { key: 'Number', value: opts.number },
    { key: 'Jersey Color', value: opts.jerseyColor },
    { key: 'Name Color', value: opts.nameColor },
    { key: 'Number Color', value: opts.numberColor },
    { key: 'Backboard', value: opts.backboardColor },
    ...(opts.previewImageUrl
      ? [{ key: 'Preview Image', value: opts.previewImageUrl }]
      : []),
  ];
}

// Plain-object form of the same properties, for Shopify's storefront
// /cart/add.js Ajax API (which takes `properties` as {key: value}, unlike
// the Admin API's {key, value}[] shape used above).
export function toCartLineProperties(opts: JerseySelectedOptions): Record<string, string> {
  return Object.fromEntries(toShopifyProperties(opts).map(({ key, value }) => [key, value]));
}

// SIZE_OPTIONS.variantId is a GID (gid://shopify/ProductVariant/123) for the
// Admin API's use; the storefront /cart.js and /cart/add.js Ajax endpoints
// take the plain numeric id instead.
export function numericVariantId(gid: string): number {
  const match = gid.match(/(\d+)$/);
  if (!match) {
    throw new Error(`Could not parse a numeric variant id from "${gid}".`);
  }
  return Number(match[1]);
}