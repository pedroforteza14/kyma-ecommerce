import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.variant_id === item.variant_id)

        if (existing) {
          set({
            items: items.map((i) =>
              i.variant_id === item.variant_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variant_id !== variantId) })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.variant_id === variantId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      total: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: 'kyma-cart' }
  )
)
