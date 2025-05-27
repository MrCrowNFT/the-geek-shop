import {
  addToWishlist,
  deleteFromWishlist,
  deleteUserAccount,
  getUserProfile,
  updateUserProfile,
} from "@/api/services/user";
import { IUpdateProfilePayload, IUser } from "@/types/user";
import { IProductUser } from "@/types/product";
import { ICreateShippingPayload, IShipping } from "@/types/shipping";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICreateOrderPayload, IOrder } from "@/types/order";
import { loginRequest, logoutRequest } from "@/api/services/auth";
import { cancelOrder, createOrder } from "@/api/services/order";
import {
  createShippingAddress,
  deleteShippingAddress,
  updateShippingAddress,
} from "@/api/services/shipping";

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
  updateProfile: (userData: IUpdateProfilePayload) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;

  // Wishlist methods
  updateWishList: (
    product: IProductUser,
    action: "add" | "remove"
  ) => Promise<void>;

  // Order methods
  createOrder: (orderData: ICreateOrderPayload) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;

  // Shipping methods
  createShipping: (shippingData: ICreateShippingPayload) => Promise<boolean>;
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
          // First attempt the login
          await loginRequest(email, password);

          try {
            // Only if login succeeds, get the user profile
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
          } catch (profileError) {
            // Handle the case where login worked but getting profile failed
            set({
              isLoading: false,
              error:
                profileError instanceof Error
                  ? `Profile retrieval failed: ${profileError.message}`
                  : "Failed to retrieve user profile",
            });
            return false;
          }
        } catch (loginError) {
          // Handle login failure
          set({
            isLoading: false,
            error:
              loginError instanceof Error
                ? `Login failed: ${loginError.message}`
                : "Login failed",
          });
          return false;
        }
      },

      logout: async () => {
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
        await logoutRequest();
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

      updateProfile: async (userData: IUpdateProfilePayload) => {
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
          await updateUserProfile(userData);

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
          await deleteUserAccount();

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

      //this should no be a optimistic update ether
      createOrder: async (orderData: ICreateOrderPayload) => {
        try {
          const createdOrder = await createOrder(orderData);

          set((state) => ({
            orders: [...state.orders, createdOrder],
            isLoading: false,
          }));

          return true;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create order",
          });

          return false;
        }
      },

      cancelOrder: async (orderId) => {
        // Store current orders for rollback if needed
        const currentOrders = [...get().orders];

        // Optimistic update -> mark the order as cancelled
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          ),
          isLoading: true,
          error: null,
        }));

        try {
          await cancelOrder(orderId);

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

      //this can't use optimistic update, the user may end up creating an order with a temp id for shipping
      //with an invalid id in the backend
      createShipping: async (shippingData: ICreateShippingPayload) => {
        set(() => ({
          isLoading: false,
          error: null,
        }));
        try {
          const createdShipping = await createShippingAddress(shippingData);

          // Update with shipping from the server
          set((state) => ({
            shipping: [...state.shipping, createdShipping],
            isLoading: false,
            error: null,
          }));

          return true;
        } catch (error) {
          ///// Rollback if API call fails
          //no longer need rollback since no longer optimistic update
          set({
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
          await updateShippingAddress(shippingId, shippingData);
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
          await deleteShippingAddress(shippingId);

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
