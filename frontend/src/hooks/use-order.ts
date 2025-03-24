import { fetchUserOrders } from "@/api/services/order";
import { useQuery } from "@tanstack/react-query";

export const useFetchUserOrders = () => {
  try {
    const data = useQuery({
      queryKey: ["orders"],
      queryFn: fetchUserOrders,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data
  } catch (err) {
    console.error("Caching or refetching orders error:", err);
    throw err;
  }
};


