import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Accessors
      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      
      // Actions
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find((item) => item._id === product._id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                _id: product._id,
                name: product.name,
                price: product.discountPrice > 0 ? product.discountPrice : product.price,
                image: product.images[0],
                unit: product.unit,
                quantity,
                stock: product.stock,
              },
            ],
          })
        }
      },

      removeOne: (productId) => {
        const { items } = get()
        const existingItem = items.find((item) => item._id === productId)

        if (existingItem.quantity > 1) {
          set({
            items: items.map((item) =>
              item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
            ),
          })
        } else {
          set({
            items: items.filter((item) => item._id !== productId),
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        })
      },

      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
)

export default useCartStore
