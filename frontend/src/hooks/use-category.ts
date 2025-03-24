import { addCategory, fetchCategories } from "@/api/services/category";
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
    console.error("Caching or refetching categories error:", err);
    throw err;
  }
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: { name: string; description?: string }) =>
      addCategory(category),
    onSuccess: () => {
      //todo, check the name
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (error) => {
      console.error("New category mutation error:", error);
      throw error;
    },
  });
};
