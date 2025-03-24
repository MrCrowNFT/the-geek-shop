import {
  createShippingAddress,
  getShippingAddressById,
  getShippingAddresses,
} from "@/api/services/shipping";
import { IShipping } from "@/types/shipping";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchShippingAddresses = () => {
  try {
    const data = useQuery({
      queryKey: ["shipping"],
      queryFn: getShippingAddresses,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching shipping addresses error:", err);
    throw err;
  }
};

export const useFetchShippingAddressById = (shippingId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["shipping", shippingId],
    queryFn: async () => {
      const cachedShippings = queryClient.getQueryData<{
        shippings: IShipping[];
      }>(["shipping"]);
      const cachedShipping = cachedShippings?.shippings.find(
        (s) => s._id === shippingId
      );

      if (cachedShipping) return cachedShipping;
      return getShippingAddressById(shippingId);
    },
    staleTime: 1000 * 60 * 5,
  });
};

