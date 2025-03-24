import { fetchCategories } from "@/api/services/category";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useFetchCategories = () => {
  try {
    const data = useQuery({
      queryKey: ["categories"],
      queryFn: fetchCategories,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching user's orders error:", err);
    throw err;
  }
};
