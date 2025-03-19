import api from "../axios";
import { IUser } from "@/types/user";

//User routes
//get user profile
export const getUserById = async (id: string) => {
  try {
    const res = await api.get<IUser>(`/user/users/profile/${id}`);
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
    const res = await api.put<IUser>(
      `/user/users/profile/${id}`,
      updatedProfile
    );
    return res.data;
  } catch (err) {
    console.error("Fetching user profile error:", err);
    throw err;
  }
};

//delete user profile
export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete<IUser>(`/user/users/profile/${id}`);
    return res.data;
  } catch (err) {
    console.error("Fetching user profile error:", err);
    throw err;
  }
};

//wishlist


//Admin routes

