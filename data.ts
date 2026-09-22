export const jerseyColors = [
  { name: "Yellow", hex: "#FFE800" },
  { name: "Orange", hex: "#FF8A00" },
  { name: "Ice Blue", hex: "#2CC5F5" },
  { name: "Green", hex: "#17D63A" },
  { name: "Red", hex: "#FF1A15" },
  { name: "Blue", hex: "#0A46FF" },
  { name: "Purple", hex: "#8A16FF" },
  { name: "Pink", hex: "#FF2E9A" },
  { name: "Neutral White", hex: "#E8C07A" },
  { name: "White", hex: "#FFFFFF" },
] as const;

import { publicAssetUrl } from "@/lib/publicAssetUrl";

export const SPORTS = [
  "Baseball",
  "Basketball",
  "Football",
  "Soccer",
  "Hockey",
] as const;

export const SPORT_MODELS: Record<string, string> = {
  Baseball: publicAssetUrl("/3d/models/BaseBall.glb"),
  Basketball: publicAssetUrl("/3d/models/Basketball.glb"),
  Football: publicAssetUrl("/3d/models/Football.glb"),
  Soccer: publicAssetUrl("/3d/models/BlueSoccer.glb"),
  Hockey: publicAssetUrl("/3d/models/Hockey.glb"),
};

export const SIZE_OPTIONS = [
  {
    value: 20,
    unit: "inch",
    variantId:
      process.env.NEXT_PUBLIC_VARIANT_ID_20 ||
      "gid://shopify/ProductVariant/48359110443244",
    price: Number(process.env.NEXT_PUBLIC_PRICE_20) || 164.99,
  },
  {
    value: 30,
    unit: "inch",
    variantId:
      process.env.NEXT_PUBLIC_VARIANT_ID_30 ||
      "gid://shopify/ProductVariant/48359110476012",
    price: Number(process.env.NEXT_PUBLIC_PRICE_30) || 299.99,
  },
] as const;

export const PRODUCT = {
  slug: "custom-glow-jersey",
  name: "Custom Glow Jersey",
  currency: "USD",
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
const COLOR_NAMES: Record<string, string> = {
  "#FFE800": "Yellow",
  "#FF8A00": "Orange",
  "#FF3300": "Orange",
  "#2CC5F5": "Ice Blue",
  "#17D63A": "Green",
  "#FF1A15": "Red",
  "#0A46FF": "Blue",
  "#0B45FF": "Blue",
  "#8A16FF": "Purple",
  "#FF2E9A": "Pink",
  "#FBECCB": "Neutral White",
  "#E8C07A": "Neutral White",
  "#FFFFFF": "White",
  "#111111": "Black",
  transparent: "Transparent",
  Transparent: "Transparent",
};

// Falls back to the raw value for any hex not in the map, rather than
// throwing, so an unrecognized swatch still reaches checkout as *something*.
export function getColorName(hexOrName: string): string {
  const key = hexOrName.trim();
  if (COLOR_NAMES[key]) return COLOR_NAMES[key];
  const found = Object.entries(COLOR_NAMES).find(
    ([k]) => k.toLowerCase() === key.toLowerCase(),
  );
  return found ? found[1] : key;
}

export function toShopifyProperties(opts: JerseySelectedOptions) {
  return [
    { key: "Size", value: `${opts.size} in` },
    { key: "Sport", value: opts.sport },
    { key: "Name", value: opts.name },
    { key: "Number", value: opts.number },
    { key: "Jersey Color", value: getColorName(opts.jerseyColor) },
    { key: "Name Color", value: getColorName(opts.nameColor) },
    { key: "Number Color", value: getColorName(opts.numberColor) },
    { key: "Backboard", value: getColorName(opts.backboardColor) },
    ...(opts.previewImageUrl
      ? [{ key: "_Preview Image", value: opts.previewImageUrl }]
      : []),
  ];
}
export function toCartLineProperties(
  opts: JerseySelectedOptions,
): Record<string, string> {
  return Object.fromEntries(
    toShopifyProperties(opts).map(({ key, value }) => [key, value]),
  );
}
export function numericVariantId(gid: string): number {
  const match = gid.match(/(\d+)$/);
  if (!match) {
    throw new Error(`Could not parse a numeric variant id from "${gid}".`);
  }
  return Number(match[1]);
}
