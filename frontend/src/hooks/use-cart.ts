import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IProductUser } from "@/types/product";

// Define cart item type (product with quantity)
export interface CartItem extends IProductUser {
  quantity: number;
}

// Define store state and actions
interface CartState {
  items: CartItem[];
  addToCart: (product: IProductUser) => void;
  removeFromCart: (productId: string) => void;
  reduceQuantity: (productId: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    //automatically saves and loads from storage
    (set) => ({
      //takes a function that receives the current state and returns an object with the changes
      items: [], //initial state

      addToCart: (product: IProductUser) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          }
        }),

      removeFromCart: (productId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),

      reduceQuantity: (productId: string) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", 
    }
  )
);
