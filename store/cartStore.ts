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
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (opts: JerseySelectedOptions, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carts: [],
      isOpen: false,
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
              unitPrice: PRODUCT.price,
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

      totalQuantity: () => get().carts.reduce((n, l) => n + l.quantity, 0),
      subtotal: () =>
        get().carts.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
    }),
    {
      name: 'glow-jersey-cart',
      partialize: (s) => ({ carts: s.carts }),
    }
  )
);