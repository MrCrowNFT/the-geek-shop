import { IOrder, OrderStatus } from "@/types/order";
import { IProductUser } from "@/types/product";
import { IShipping } from "@/types/shipping";
import { create } from "zustand";

interface OrderItem {
  quantity: number;
  product: IProductUser;
}

interface OrderState {
  currentOrder: Partial<IOrder> | null; // Change to Partial<IOrder> to allow incomplete order during initialization
  checkoutStep: number; // 1: confirmation, 2: shipping, 3: payment, 4: complete
  availableShippingAddresses: IShipping[];
  selectedShippingId: string | null;

  // Actions
  initializeOrder: (items: OrderItem[]) => void;
  setShippingAddress: (shippingId: string) => void;
  setAvailableShippingAddresses: (addresses: IShipping[]) => void;
  setOrderStatus: (status: OrderStatus) => void;
  setPaymentIntentId: (id: string) => void;
  setOrderId: (id: string) => void;
  setCheckoutStep: (step: number) => void;
  resetOrder: () => void;
  calculateTotal: () => number;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  currentOrder: null,
  checkoutStep: 1,
  availableShippingAddresses: [],
  selectedShippingId: null,

  initializeOrder: (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => {
      const price = item.product.discount.status
        ? item.product.priceTag -
          (item.product.priceTag * item.product.discount.amount) / 100
        : item.product.priceTag;
      return sum + price * item.quantity;
    }, 0);

    // Transform cart items to the backend format
    const products = items.map((item) => ({
      id: item.product._id,
      quantity: item.quantity,
    }));

    // Initialize with only the fields we have now
    set({
      currentOrder: {
        products,
        paid_amount: total,
        status: "Pending",
      },
      checkoutStep: 1,
    });
  },

  setShippingAddress: (shippingId: string) => {
    set((state) => ({
      currentOrder: state.currentOrder
        ? { ...state.currentOrder, shipping: shippingId }
        : null,
      selectedShippingId: shippingId,
    }));
  },

  setAvailableShippingAddresses: (addresses: IShipping[]) => {
    set({ availableShippingAddresses: addresses });
  },

  setOrderStatus: (status: OrderStatus) => {
    set((state) => ({
      currentOrder: state.currentOrder
        ? { ...state.currentOrder, status }
        : null,
    }));
  },

  setPaymentIntentId: (id: string) => {
    set((state) => ({
      currentOrder: state.currentOrder
        ? { ...state.currentOrder, paymentIntentId: id }
        : null,
    }));
  },

  setOrderId: (id: string) => {
    set((state) => ({
      currentOrder: state.currentOrder
        ? { ...state.currentOrder, _id: id }
        : null,
    }));
  },

  setCheckoutStep: (step: number) => {
    set({ checkoutStep: step });
  },

  resetOrder: () => {
    set({
      currentOrder: null,
      checkoutStep: 1,
      selectedShippingId: null,
    });
  },

  calculateTotal: () => {
    const { currentOrder } = get();
    if (!currentOrder) return 0;

    return currentOrder.paid_amount;
  },
}));
