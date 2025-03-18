import type { IProductAdmin, IProductUser } from "./product";
import { IShipping } from "./shipping";
import { IUser } from "./user";
import { ITracking } from "./tracking";

export interface IOrder {
  _id: string;
  user: string | IUser;
  tracking: string | ITracking;
  shipping: string | IShipping; //when creating the order is easies to just send the shipping id
  products: {
    id: string | IProductUser | IProductAdmin; //this will depend on who is getting it. and when creating just the id string
    quantity: number;
  }[];
  paid_amount: number;
  status: "Pending" | "Paid" | "OnRoute" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrdersData {
  orders?: IOrder[];
}
