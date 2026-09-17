'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JerseySelectedOptions } from '@/data';
import { PRODUCT } from '@/data';
import { computeJerseyPrice } from '@/lib/pricing';
import {
  fetchStorefrontCart,
  updateStorefrontCartItem,
  type StorefrontCartItem,
} from '@/lib/shopify/storefrontCart';

export type CartLine = {
  id: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: JerseySelectedOptions;
};

type CartStore = {
  carts: CartLine[];
  isOpen: boolean;
  // The real Shopify cart (only resolves through the App Proxy). Lives here
  // rather than in a single component so both the nav bar badge and the
  // cart drawer see the same, current state.
  storefrontItems: StorefrontCartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (opts: JerseySelectedOptions, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
  refreshStorefrontCart: () => Promise<void>;
  updateStorefrontItem: (key: string, quantity: number) => Promise<void>;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carts: [],
      isOpen: false,
      storefrontItems: [],
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (selectedOptions, quantity = 1) => {
        const id = `jersey-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        set((state) => ({
          carts: [
            ...state.carts,
            {
              id,
              productTitle: PRODUCT.name,
              unitPrice: computeJerseyPrice(selectedOptions.size),
              quantity: Math.max(1, quantity),
              selectedOptions,
            },
          ],
          isOpen: true,
        }));
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          carts: state.carts.map((l) =>
            l.id === id ? { ...l, quantity: Math.max(1, Math.min(99, quantity)) } : l
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          carts: state.carts.filter((l) => l.id !== id),
        })),

      clearCart: () => set({ carts: [] }),

      totalQuantity: () =>
        get().carts.reduce((n, l) => n + l.quantity, 0) +
        get().storefrontItems.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().carts.reduce((n, l) => n + l.unitPrice * l.quantity, 0) +
        get().storefrontItems.reduce((n, i) => n + i.line_price, 0) / 100,

      refreshStorefrontCart: async () => {
        const items = await fetchStorefrontCart();
        set({ storefrontItems: items });
      },
      updateStorefrontItem: async (key, quantity) => {
        const items = await updateStorefrontCartItem(key, quantity);
        set({ storefrontItems: items });
      },
    }),
    {
      name: 'glow-jersey-cart',
      partialize: (s) => ({ carts: s.carts }),
    }
  )
);