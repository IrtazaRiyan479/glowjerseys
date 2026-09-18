'use client';

import { create } from 'zustand';
import {
  fetchStorefrontCart,
  addToStorefrontCart,
  updateStorefrontCartItem,
  type StorefrontCartItem,
} from '@/lib/shopify/storefrontCart';

type CartStore = {
  isOpen: boolean;
  // The real Shopify cart (only resolves through the App Proxy) — the one
  // and only cart. Jerseys are added to it directly (as the real product
  // variant + line item properties for the customization), so it's genuinely
  // shared with the rest of the store: visible and editable from either side,
  // in sync no matter where the customer adds to or checks out from.
  storefrontItems: StorefrontCartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
  refreshStorefrontCart: () => Promise<void>;
  addStorefrontItem: (
    variantId: number,
    quantity: number,
    properties: Record<string, string>
  ) => Promise<void>;
  updateStorefrontItem: (key: string, quantity: number) => Promise<void>;
};

export const useCartStore = create<CartStore>()((set, get) => ({
  isOpen: false,
  storefrontItems: [],
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  totalQuantity: () => get().storefrontItems.reduce((n, i) => n + i.quantity, 0),
  subtotal: () => get().storefrontItems.reduce((n, i) => n + i.line_price, 0) / 100,

  refreshStorefrontCart: async () => {
    const items = await fetchStorefrontCart();
    set({ storefrontItems: items });
  },
  addStorefrontItem: async (variantId, quantity, properties) => {
    const items = await addToStorefrontCart(variantId, quantity, properties);
    set({ storefrontItems: items, isOpen: true });
  },
  updateStorefrontItem: async (key, quantity) => {
    const items = await updateStorefrontCartItem(key, quantity);
    set({ storefrontItems: items });
  },
}));
