import {create} from "zustand";
import {persist} from "zustand/middleware";

export interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    quantity?: number;
  }
  
  // Define cart item type (product with quantity)
  export interface CartItem extends Product {
    quantity: number;
  }
  
  // Define store state and actions
  interface CartState {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    reduceQuantity: (productId: number) => void;
    clearCart: () => void;
  }

  export const useCart = create<CartState>()(
    persist( //automatically saves and loads from storage
        (set) => ({//takes a function that receives the current state and returns an object with the changes
          items: [],//initial state
          
          addToCart: (product: Product) => set((state) => {
            const existingItem = state.items.find(item => item.id === product.id);
            
            if (existingItem) {
              return {
                items: state.items.map(item => 
                  item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                )
              };
            } else {
              return {
                items: [...state.items, { ...product, quantity: 1 }]
              };
            }
          }),
          
          removeFromCart: (productId: number) => set((state) => ({
            items: state.items.filter(item => item.id !== productId)
          })),
          
          reduceQuantity: (productId: number) => set((state) => ({
            items: state.items
              .map(item => 
                item.id === productId 
                  ? { ...item, quantity: item.quantity - 1 } 
                  : item
              )
              .filter(item => item.quantity > 0)
          })),
          
          clearCart: () => set({ items: [] })
        }),
        {
          name: 'cart-storage', // unique name for localStorage
        }
      )
    );