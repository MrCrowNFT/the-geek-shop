import type { IProductAdmin, IProductUser } from "./product";
import { IShipping } from "./shipping";
import { IUser } from "./user";
import { ITracking } from "./tracking";

export interface IOrder {
  _id: string;
  user: string | IUser;
  tracking?: string | ITracking;//tracking will be assigned later on the order's life so i need to make it optional 
  shipping: string | IShipping; //when creating the order is easier to just send the shipping id
  products: {
    id: string | IProductUser | IProductAdmin; //this will depend on who is getting it. And, when creating, just need the id string
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

export interface IOrderSearchParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
}
