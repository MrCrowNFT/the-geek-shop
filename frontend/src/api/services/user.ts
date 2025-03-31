import { IUpdateProfilePayload, IUser } from "@/types/user";
import api from "../axios";
import { SignupParams } from "@/types/api";

// User routes
// get user profile
//todo check url
export const getUserProfile = async ():Promise<IUser> => {
  try {
    const res = await api.get(`/user/users/profile`);
    return res.data;
  } catch (err) {
    console.error("Fetching user profile error:", err);
    throw err;
  }
};

// update user profile
export const updateUserProfile = async (updatedProfile: IUpdateProfilePayload) => {
  try {
    const res = await api.put(`/user/users/profile`, updatedProfile);
    return res.data;
  } catch (err) {
    console.error("Updating user profile error:", err);
    throw err;
  }
};

// delete user profile
export const deleteUserAccount = async () => {
  try {
    const res = await api.delete(`/user/users/profile`);
    return res.data;
  } catch (err) {
    console.error("Deleting user profile error:", err);
    throw err;
  }
};

// wishlist
// get
export const getWishlist = async () => {
  try {
    const res = await api.get(`/user/wishlist`);
    return res.data;
  } catch (err) {
    console.error("Fetching user's wishlist error:", err);
    throw err;
  }
};

// add
export const addToWishlist = async (productId: string) => {
  try {
    const res = await api.post(`/user/wishlist`, { productId });
    return res.data;
  } catch (err) {
    console.error("Adding to wishlist error: ", err);
    throw err;
  }
};

// delete from it
export const deleteFromWishlist = async (productId: string) => {
  try {
    const res = await api.delete(`/user/wishlist/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Removing product from wishlist error:", err);
    throw err;
  }
};

// Admin routes
export const createAdmin = async ({
  username,
  email,
  password,
}: SignupParams) => {
  try {
    const res = await api.post("/user/admin", { username, email, password });
    return res.data;
  } catch (err) {
    console.error("Creating admin error:", err);
    throw err;
  }
};

export const getAdmins = async () => {
  try {
    const res = await api.get("/user/admin");
    return res.data;
  } catch (err) {
    console.error("Getting admins error:", err);
    throw err;
  }
};

export const getAdminById = async (id: string) => {
  try {
    const res = await api.get(`/user/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error("Getting admin error:", err);
    throw err;
  }
};

export const updateAdminById = async (
  id: string,
  updatedProfile: { username?: string; email?: string; password?: string }
) => {
  try {
    const res = await api.put(`/user/admin/${id}`, updatedProfile);
    return res.data;
  } catch (err) {
    console.error("Updating admin error:", err);
    throw err;
  }
};

export const deleteAdminById = async (id: string) => {
  try {
    const res = await api.delete(`/user/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error("Deleting admin error:", err);
    throw err;
  }
};
