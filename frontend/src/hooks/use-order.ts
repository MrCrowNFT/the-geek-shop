import {
  getAllOrders,
  getOrderById,
  orderSearch,
  updateOrder,
} from "@/api/services/order";
import { IOrder, IOrderSearchParams } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Admin order hooks
export const useFetchAllOrders = () => {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: getAllOrders,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: (error) => {
      console.error("Fetching orders error:", error);
    },
  });
};

export const useFetchOrderById = (orderId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["adminOrders", orderId],
    queryFn: async () => {
      const cachedOrders = queryClient.getQueryData<{ adminOrders: IOrder[] }>([
        "adminOrders",
      ]);
      const cachedOrder = cachedOrders?.adminOrders.find(
        (o) => o._id === orderId
      );

      if (cachedOrder) return cachedOrder;

      return getOrderById(orderId);
    },
    staleTime: 1000 * 60 * 5,
  });
};

//todo: check the api call
//* currently not using it since there aren't that many orders
export const useOrderSearch = (params: IOrderSearchParams) => {
  return useQuery({
    queryKey: ["adminOrders", params],
    queryFn: () => orderSearch(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

//todo: there is a fundamental issue right, so, i put the status on the order, maybe should have putted it into the
//todo: tracking, so that i can just change the tracking, give it a thought.
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updateData,
    }: {
      id: string;
      updateData: { shipping?: string; tracking?: string; status?: string };
    }) => updateOrder(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error) => {
      console.error("Update order mutation error:", error);
    },
  });
};
