import { IOrder } from "./order";
import { IProductUser } from "./product";
import { IShipping } from "./shipping";

//this one is what will arrive from backend from get call
export interface IUser {
  _id: string;
  username: string;
  profile_pic: string;
  email: string;
  role: "admin" | "super_admin" | "user";
  orders: IOrder[];
  shipping: IShipping[];
  wishlist: IProductUser[];
  createdAt: Date;
  updatedAt: Date;
}


export interface IUserCardProps {
  user: IUser;
}
