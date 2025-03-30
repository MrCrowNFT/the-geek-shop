import {
  addToWishlist,
  deleteFromWishlist,
  getUserProfile,
  updateUserProfileRequest,
  deleteUserProfileRequest,
  // Order API imports would go here
  // Shipping API imports would go here
} from "@/api/services/user";
import { IUser } from "@/types/user";
import { IProductUser } from "@/types/product";
import { IShipping } from "@/types/shipping";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IOrder } from "@/types/order";
import { loginRequest, logoutRequest } from "@/api/services/auth";

//TODO ADD API CALLS

type ProfileState = {
  _id: string;
  username: string;
  profile_pic: string;
  email: string;
  role: "admin" | "super_admin" | "user";
  orders: IOrder[];
  shipping: IShipping[];
  wishlist: IProductUser[];
  createdAt: Date | null;
  updatedAt: Date | null;
  initialized: boolean;
  isLoading: boolean;
  error: string | null;
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Profile methods
  setProfile: (user: IUser) => void;
  updateProfile: (userData: Partial<IUser>) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;

  // Wishlist methods
  updateWishList: (
    product: IProductUser,
    action: "add" | "remove"
  ) => Promise<void>;

  // Order methods
  createOrder: (orderData: Omit<IOrder, "_id">) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;

  // Shipping methods
  createShipping: (shippingData: Omit<IShipping, "_id">) => Promise<boolean>;
  updateShipping: (
    shippingId: string,
    shippingData: Partial<IShipping>
  ) => Promise<boolean>;
  deleteShipping: (shippingId: string) => Promise<boolean>;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      _id: "",
      username: "",
      profile_pic: "",
      email: "",
      role: "user",
      orders: [],
      shipping: [],
      wishlist: [],
      createdAt: null,
      updatedAt: null,
      initialized: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // login and then get user profile
          await loginRequest(email, password);
          const userData: IUser = await getUserProfile();

          // Set the profile with all user data
          set({
            _id: userData._id,
            username: userData.username,
            profile_pic: userData.profile_pic,
            email: userData.email,
            role: userData.role,
            orders: userData.orders,
            shipping: userData.shipping,
            wishlist: userData.wishlist,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            initialized: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          return false;
        }
      },

      logout: () => {
        set({
          _id: "",
          username: "",
          profile_pic: "",
          email: "",
          role: "user",
          orders: [],
          shipping: [],
          wishlist: [],
          createdAt: null,
          updatedAt: null,
          initialized: false,
          error: null,
          isLoading: false,
        });
        logoutRequest();
      },

      setProfile: (userData: IUser) =>
        set({
          _id: userData._id,
          username: userData.username,
          profile_pic: userData.profile_pic,
          email: userData.email,
          role: userData.role,
          orders: userData.orders,
          shipping: userData.shipping,
          wishlist: userData.wishlist,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          initialized: true,
        }),

      updateProfile: async (userData: Partial<IUser>) => {
        // Store current state for rollback if needed
        const previousState = { ...get() };

        // Optimistic update
        set((state) => ({
          ...state,
          ...userData,
          isLoading: true,
          error: null,
        }));

        try {
          // Add updateUserProfileRequest function in the API services
          await updateUserProfileRequest(userData);

          // Update succeeded, update timestamp
          set((state) => ({
            ...state,
            updatedAt: new Date(),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            ...previousState,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to update profile",
          });

          return false;
        }
      },

      deleteProfile: async () => {
        // Store current state for rollback if needed
        const previousState = { ...get() };

        // Set loading state
        set({ isLoading: true, error: null });

        try {
          // Add deleteUserProfileRequest function in the API services
          await deleteUserProfileRequest();

          // On successful deletion, clear the profile state
          set({
            _id: "",
            username: "",
            profile_pic: "",
            email: "",
            role: "user",
            orders: [],
            shipping: [],
            wishlist: [],
            createdAt: null,
            updatedAt: null,
            initialized: false,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            ...previousState,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete profile",
          });

          return false;
        }
      },

      updateWishList: async (product, action) => {
        // Optimistic update
        set((state) => ({
          wishlist:
            action === "add"
              ? [...state.wishlist, product]
              : state.wishlist.filter((item) => item._id !== product._id),
        }));

        try {
          if (action === "add") {
            await addToWishlist(product._id);
          } else {
            await deleteFromWishlist(product._id);
          }
        } catch (error) {
          // Rollback if API call fails
          set((state) => ({
            wishlist:
              action === "add"
                ? state.wishlist.filter((item) => item._id !== product._id)
                : [...state.wishlist, product],
            error:
              error instanceof Error
                ? error.message
                : "Failed to update wishlist",
          }));
          console.error("Failed to update wishlist:", error);
        }
      },

      createOrder: async (orderData) => {
        // Store current orders for rollback if needed
        const currentOrders = [...get().orders];

        // Generate a temporary ID for optimistic update
        const tempId = `temp_${Date.now()}`;
        const newOrder: IOrder = {
          _id: tempId,
          ...orderData,
        };

        // Optimistic update
        set((state) => ({
          orders: [...state.orders, newOrder],
          isLoading: true,
          error: null,
        }));

        try {
          // Add createOrderRequest function in the API services
          // const createdOrder = await createOrderRequest(orderData);

          // Simulating API response for now
          const createdOrder = { ...newOrder, _id: `real_${tempId}` };

          // Update with the actual order from the server
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === tempId ? createdOrder : order
            ),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            orders: currentOrders,
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to create order",
          });

          return false;
        }
      },

      cancelOrder: async (orderId) => {
        // Store current orders for rollback if needed
        const currentOrders = [...get().orders];

        // Optimistic update - mark the order as cancelled
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          ),
          isLoading: true,
          error: null,
        }));

        try {
          // Add cancelOrderRequest function in the API services
          // await cancelOrderRequest(orderId);

          // Request succeeded, we can keep the optimistic update
          set({ isLoading: false });

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            orders: currentOrders,
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Failed to cancel order",
          });

          return false;
        }
      },

      createShipping: async (shippingData) => {
        // Store current shipping addresses for rollback if needed
        const currentShipping = [...get().shipping];

        // Generate a temporary ID for optimistic update
        const tempId = `temp_${Date.now()}`;
        const newShipping: IShipping = {
          _id: tempId,
          ...shippingData,
        };

        // Optimistic update
        set((state) => ({
          shipping: [...state.shipping, newShipping],
          isLoading: true,
          error: null,
        }));

        try {
          // Add createShippingRequest function in the API services
          // const createdShipping = await createShippingRequest(shippingData);

          // Simulating API response for now
          const createdShipping = { ...newShipping, _id: `real_${tempId}` };

          // Update with the actual shipping from the server
          set((state) => ({
            shipping: state.shipping.map((shipping) =>
              shipping._id === tempId ? createdShipping : shipping
            ),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            shipping: currentShipping,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to create shipping address",
          });

          return false;
        }
      },

      updateShipping: async (shippingId, shippingData) => {
        // Store current shipping addresses for rollback if needed
        const currentShipping = [...get().shipping];

        // Optimistic update
        set((state) => ({
          shipping: state.shipping.map((shipping) =>
            shipping._id === shippingId
              ? { ...shipping, ...shippingData }
              : shipping
          ),
          isLoading: true,
          error: null,
        }));

        try {
          // Add updateShippingRequest function in the API services
          // await updateShippingRequest(shippingId, shippingData);

          // Request succeeded, we can keep the optimistic update
          set({ isLoading: false });

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            shipping: currentShipping,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to update shipping address",
          });

          return false;
        }
      },

      deleteShipping: async (shippingId) => {
        // Store current shipping addresses for rollback if needed
        const currentShipping = [...get().shipping];

        // Optimistic update
        set((state) => ({
          shipping: state.shipping.filter(
            (shipping) => shipping._id !== shippingId
          ),
          isLoading: true,
          error: null,
        }));

        try {
          // Add deleteShippingRequest function in the API services
          // await deleteShippingRequest(shippingId);

          // Request succeeded, we can keep the optimistic update
          set({ isLoading: false });

          return true;
        } catch (error) {
          // Rollback if API call fails
          set({
            shipping: currentShipping,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete shipping address",
          });

          return false;
        }
      },
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({
        _id: state._id,
        username: state.username,
        profile_pic: state.profile_pic,
        email: state.email,
        role: state.role,
        orders: state.orders,
        shipping: state.shipping,
        wishlist: state.wishlist,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
        initialized: state.initialized,
      }),
    }
  )
);
