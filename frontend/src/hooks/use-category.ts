import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/api/services/category";
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

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      id,
      category,
    }: {
      id: string;
      category: { name?: string; description?: string };
    }) => updateCategory(id, category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (error) => {
        console.error("Update category mutation error:", error);
        throw error;
      },
    }
  );
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteCategory(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Delete category mutation error:", error);
      throw error;
    },
  });
};
