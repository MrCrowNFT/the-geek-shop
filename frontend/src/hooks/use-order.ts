import {
  cancelOrder,
  createOrder,
  fetchUserOrders,
} from "@/api/services/order";
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
