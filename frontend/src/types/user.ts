import { IOrdersData } from "./order";
import { IProductUser } from "./product";
import { IShippingAddresses } from "./shipping";

export interface IUser {
  _id?: string;
  username: string;
  profile_pic: string;
  email: string;
  role: "admin" | "super_admin" | "user";
  orders: string[] | IOrdersData;
  shipping: string[] | IShippingAddresses[];
  wishlist: string[] | IProductUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCardProps {
  user: IUser
}
