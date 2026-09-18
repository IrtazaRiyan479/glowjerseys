import { SIZE_OPTIONS } from '@/data';

export function getSizeOption(size: number) {
  const option = SIZE_OPTIONS.find((o) => o.value === size);
  if (!option) {
    throw new Error(`Unknown jersey size: ${size}`);
  }
  return option;
}

/**
 * The authoritative jersey price. Only size affects price today — color,
 * name/number personalization, backboard, and sport are free per current
 * store pricing. Used both client-side (configurator display) and
 * server-side (create-draft-order route, where it's the price of record —
 * never a client-supplied number).
 */
export function computeJerseyPrice(size: number): number {
  return getSizeOption(size).price;
}
