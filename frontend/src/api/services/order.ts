import api from "../axios";
import { IOrder } from "@/types/order";

//User calls
// Fetch all user orders
export const fetchUserOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await api.get<IOrder[]>("/order");
    return response.data;
  } catch (err) {
    console.error("Fetching User's orders error:", err);
    throw err;
  }
};

// Create a new order
export const createOrder = async (orderData: {
  shipping: string;
  products: { id: string; quantity: number }[];
  paid_amount: number;
}) => {
  try {
    const response = await api.post<IOrder>("/order/new", orderData);
    return response.data;
  } catch (err) {
    console.error("Creating order error:", err);
    throw err;
  }
};

// Cancel an order
export const cancelOrder = async (id: string) => {
  try {
    const response = await api.put<{ message: string; order: IOrder }>(
      `/order/${id}/cancel`,
      {}
    );
    return response.data;
  } catch (err) {
    console.error("Cancelling order error:", err);
    throw err;
  }
};
