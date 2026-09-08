'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JerseySelectedOptions } from '@/data';
import { PRODUCT } from '@/data';

export type CartLine = {
  id: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: JerseySelectedOptions;
};

type CartStore = {
  carts: CartLine[];
  addItem: (opts: JerseySelectedOptions, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      carts: [],
     addItem: (selectedOptions, quantity = 1) =>
  set((state) => ({
    carts: [
      ...state.carts,
      {
        id: `jersey-${Date.now()}-...`,
        productTitle: PRODUCT.name,
        unitPrice: PRODUCT.price,
        quantity: Math.max(1, quantity),
        selectedOptions,
      },
    ],
  })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          carts: state.carts.map((l) =>
            l.id === id ? { ...l, quantity: Math.max(1, quantity) } : l
          ),
        })),
      removeItem: (id) =>
        set((state) => ({ carts: state.carts.filter((l) => l.id !== id) })),
      clearCart: () => set({ carts: [] }),
    }),
    { name: 'glow-jersey-cart' }
  )
);