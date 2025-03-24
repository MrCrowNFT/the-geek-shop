import {
  cancelOrder,
  createOrder,
  fetchUserOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "@/api/services/order";
import { IOrder } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//User order hooks
export const useFetchUserOrders = () => {
  try {
    const data = useQuery({
      queryKey: ["orders"],
      queryFn: fetchUserOrders,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching orders error:", err);
    throw err;
  }
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData: {
      shipping: string;
      products: { id: string; quantity: number }[];
      paid_amount: number;
    }) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.error("Create order mutation error:", error);
      throw error;
    },
  });
};

//todo: since i will have the orders on the cache i can just check on that date first
//todo: to check if is cancelable before trying to make the api call,
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      //todo check names
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.error("Canceling order mutation error:", error);
      throw error;
    },
  });
};

//Admin order hooks
//todo: there is an issue here, logical, shouldn't use this hook
//todo: is is better to use the order rearch without any string,
//todo: to not overload the client side
export const useFetchAllOrders = () => {
  try {
    const data = useQuery({
      queryKey: ["admin orders"],
      queryFn: getAllOrders,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching admin orders error:", err);
    throw err;
  }
};

//since i am getting orders and putting them on the cache
//just get the data from the cache to render the order details
//minimizing the amount of api calls i need
export const useFetchOrderById = (orderId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      //check if the order is on the cached orders, if is not, make the api call
      const cachedOrders = queryClient.getQueryData<{ orders: IOrder[] }>([
        "orders",
      ]);
      const cachedOrder = cachedOrders?.orders.find((o) => o._id === orderId);

      if (cachedOrder) return cachedOrder;

      return getOrderById(orderId);
    },
    staleTime: 1000 * 60 * 5, // Keep cache fresh for 5 mins
  });
};

//TODO: MSSING ORDER SEARCH HOOK

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      id,
      updateData,
    }: {
      id: string;
      updateData: { shipping?: string; tracking?: string; status?: string };
    }) => updateOrder(id, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
      onError: (error) => {
        console.error("Update order mutation error:", error);
        throw error;
      },
    }
  );
};
