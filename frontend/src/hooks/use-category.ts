import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/api/services/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//TODO DELETE TRY CATCH BLOCKS
//TODO React Query handles errors itself. Wrapping useQuery in try/catch
//TODO doesn’t actually catch runtime query errors—it catches only immediate
//TODO errors from invalid hook usage (which won’t happen here).

export const useFetchCategories = () => {
  try {
    const data = useQuery({
      queryKey: ["categories"],
      queryFn: fetchCategories,
      staleTime: 1000 * 60 * 5, //5 minutes
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching categories error:", err);
    throw err;
  }
};

//Admin only
export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: { name: string; description?: string }) =>
      addCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
