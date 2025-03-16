import type { Product } from "./product";

interface Shipping {
  name: string;
  phome: string;
  run: string;
  address: string;
  region: string;
  indications?: string;
}

interface User {
  username: string;
  email: string;
}

export interface OrdersData {
  orders: Order[];
}

interface Order {
  _id: string;
  user: User;
  shipping: Shipping;
  products: {
    id: Product;
    quantity: number;
  }[];
  paid_amount: number;
  status: "Pending" | "Paid" | "OnRoute" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}
