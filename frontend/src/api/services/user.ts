import api from "../axios";
import { SignupParams } from "@/types/api";

//User routes
//get user profile
export const getUserById = async (id: string) => {
  try {
    const res = await api.get(`/user/users/profile/${id}`);
    return res.data;
  } catch (err) {
    console.error("Fetching user profile error:", err);
    throw err;
  }
};

//update user profile
export const updateUser = async (
  id: string,
  updatedProfile: { username?: string; email?: string; password?: string }
) => {
  try {
    const res = await api.put(`/user/users/profile/${id}`, updatedProfile);
    return res.data;
  } catch (err) {
    console.error("Updating user profile error:", err);
    throw err;
  }
};

//delete user profile
export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`/user/users/profile/${id}`);
    return res.data;
  } catch (err) {
    console.error("Deleting user profile error:", err);
    throw err;
  }
};

//wishlist
//get
export const getWishlist = async (id: string) => {
  try {
    const res = await api.delete(`/user/users/wishlist/${id}`);
    return res.data;
  } catch (err) {
    console.error("Fetching user's wishlist error:", err);
    throw err;
  }
};

//add
export const addToWishlist = async (id: string, productId: string) => {
  try {
    //the server expects an object with the product id, not an alone string
    const res = await api.post(`/user/users/wishlist/${id}`, { productId });
    return res.data;
  } catch (err) {
    console.error("Adding to wishlist error: ", err);
    throw err;
  }
};

//delete from it
export const deleteFromWishlist = async (id: string, productId: string) => {
  try {
    //need to use data so that productId gets included on the body
    const res = await api.delete(`/user/users/wishlist/${id}`, {
      data: { productId },
    });
    return res.data;
  } catch (err) {
    console.error("Removing product from wishlist error:", err);
    throw err;
  }
};

//Admin routes
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
    console.error("Getting admin error:", err);
    throw err;
  }
};
export const deleteAdminById = async (id: string) => {
  try {
    const res = await api.delete(`/user/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error("Getting admin error:", err);
    throw err;
  }
};
