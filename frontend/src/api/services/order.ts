import api from "../axios";
import { ICreateOrderPayload, IOrder, IOrderSearchParams } from "@/types/order";

//User calls
// Fetch all user orders
//todo no longer really need this one, since it comes with the user profile
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
export const createOrder = async (
  orderData: ICreateOrderPayload
): Promise<IOrder> => {
  try {
    const res = await api.post<IOrder>("/order/new", orderData);
    return res.data;
  } catch (err) {
    console.error("Creating order error:", err);
    throw err;
  }
};

//todo check the return value, not implemented yet, it returns a message and the cancelled order
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
export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const res = await api.get("/order/admin/");
    return res.data.data; //* this was the simplest option, not using the message
  } catch (err) {
    console.error("Fetching orders error:", err);
    throw err;
  }
};

export const getOrderById = async (id: string): Promise<IOrder> => {
  try {
    const res = await api.get(`/order/admin/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Fetching order error:", err);
    throw err;
  }
};

//todo this returns a bool + pagination+ orders, keep this in mind when integrating
//the server has a default value for the page and limit
export const orderSearch = async (searchParams: IOrderSearchParams) => {
  try {
    const res = await api.get(`/order/admin/search`, {
      params: searchParams,
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
