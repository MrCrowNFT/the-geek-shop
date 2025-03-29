import { addToWishlist, deleteFromWishlist } from "@/api/services/user";
import { IOrder } from "@/types/order";
import { IProductUser } from "@/types/product";
import { IShipping } from "@/types/shipping";
import { create } from "zustand";
import { persist } from "zustand/middleware";

//todo: need to add more methods for the orders and shipping
//todo: so that it updates when user created any of them
type ProfileState = {
  username: string;
  profile_pic: string;
  email: string;
  orders: IOrder[];
  shipping: IShipping[];
  wishlist: IProductUser[];
  initialized: boolean;
  setProfile: (profile: ProfileState) => void;
  updateWishList: (product: IProductUser, action: "add" | "remove") => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      username: "",
      profile_pic: "",
      email: "",
      orders: [],
      shipping: [],
      wishlist: [],
      initialized: false, //need to track if profile is set

      //to be set whem user logs in
      setProfile: (profile) => set({ ...profile, initialized: true }),

      updateWishList: async (product, action) => {
        set((state) => ({
          wishlist:
            action === "add"
              ? [...state.wishlist, product] //optimistic update
              : state.wishlist.filter((item) => item._id !== product._id),
        }));
        try {
          if (action === "add") {
            await addToWishlist(product._id);
          } else {
            await deleteFromWishlist(product._id);
          }
        } catch (error) {
          set((state) => ({
            wishlist:
              action === "add"
                ? state.wishlist.filter((item) => item._id !== product._id) // Rollback if api call fails
                : [...state.wishlist, product],
          }));
          console.error("Failed to update wishlist:", error);
        }
      },
    }),
    {
      name: "profile-storage",
    }
  )
);
