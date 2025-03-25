import { IUser } from "@/types/user";

export const mockAdmin:IUser = {
  _id: "user123",
  username: "johndoe",
  profile_pic: "/cat-favicon.svg",
  email: "john@example.com",
  role: "admin",
  orders: [],
  shipping: [],
  wishlist: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
