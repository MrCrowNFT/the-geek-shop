import {
  createShippingAddress,
  deleteShippingAddress,
  getShippingAddressById,
  getShippingAddresses,
  updateShippingAddress,
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

export const useCreateShipping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newShippingAddress: {
      name: string;
      phone: string;
      run: string;
      address: string;
      region: string;
      indications?: string;
    }) => createShippingAddress(newShippingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping"] });
    },
    onError: (error) => {
      console.error("Create shipping mutation error:", error);
      throw error;
    },
  });
};

export const useUpdateShipping = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      id,
      updateData,
    }: {
      id: string;
      updateData: {
        name?: string;
        phone?: string;
        run?: string;
        address?: string;
        region?: string;
        indications?: string;
      };
    }) => updateShippingAddress(id, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["shipping"] });
      },
      onError: (error) => {
        console.error("Update shipping mutation error:", error);
        throw error;
      },
    }
  );
};

export const useDeleteShipping = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteShippingAddress(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["shipping"]);
    },
    onError: (error) => {
      console.error("Deleting shipping mutation error:", error);
      throw error;
    },
  });
};
