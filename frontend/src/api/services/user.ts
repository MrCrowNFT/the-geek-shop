import api from "../axios";

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
    //
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
