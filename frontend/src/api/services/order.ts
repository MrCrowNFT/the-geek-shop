import api from "../axios";
import { IOrder } from "@/types/order";

//User calls
// Fetch all user orders
export const fetchUserOrders = async (): Promise<IOrder[]> => {
  try {
    const res = await api.get<IOrder[]>("/order");
    return res.data;
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
    const res = await api.post<IOrder>("/order/new", orderData);
    return res.data;
  } catch (err) {
    console.error("Creating order error:", err);
    throw err;
  }
};

// Cancel an order
export const cancelOrder = async (id: string) => {
  try {
    const res = await api.put<{ message: string; order: IOrder }>(
      `/order/${id}/cancel`,
      {}
    );
    return res.data;
  } catch (err) {
    console.error("Cancelling order error:", err);
    throw err;
  }
};

//Admin only
export const getAllOrders = async () => {
  try {
    const res = await api.get("/order/admin/");
    return res.data;
  } catch (err) {
    console.error("Fetching orders error:", err);
    throw err;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res = await api.get(`/order/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error("Fetching order error:", err);
    throw err;
  }
};

//the server has a default value for the page and limit
export const orderSearch = async (
  searchTerm ?: string,
  page?: number,
  limit?: number
) => {
  try {
    const res = await api.get(`/order/admin/search`, {
      params: {
        searchTerm,
        page,
        limit,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Searching order error:", err);
    throw err;
  }
};

//should only be used to add the tracking bit and update state
export const updateOrder = async (
  id: string,
  updateData: {
    shipping?: string; //in case a user made a mistake
    tracking?: string;
    status?: string; //todo: just string for now, but there should only be 5 options
  }
) => {
  try {
    const res = await api.put(`/order/admin/${id}`, updateData);
    return res.data;
  } catch (err) {
    console.error("Updating order error:", err);
    throw err;
  }
};
