import axios from "axios";
import { IOrder } from "@/types/order";

const API_URL = "http://localhost:5500/order";

// Fetch all user orders
export const fetchUserOrders = async (token: string): Promise<IOrder[]> => {
  try {
    const response = await axios.get<IOrder[]>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Fetching User's orders error:", err);
    throw err;
  }
};

// Create a new order
export const createOrder = async (
  orderData: {
    shipping: string;
    products: { id: string; quantity: number }[];
    paid_amount: number;
  },
  token: string
) => {
  try {
    const response = await axios.post<IOrder>(`${API_URL}/new`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Creating order error:", err);
    throw err;
  }
};

// Cancel an order
export const cancelOrder = async (id: string, token: string) => {
  try {
    const response = await axios.put<{ message: string; order: IOrder }>(
      `${API_URL}/${id}/cancel`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Cancelling order error:", err);
    throw err;
  }
};
