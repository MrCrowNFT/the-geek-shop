import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ICreateProductPayload,
  IProductUser,
  ISearchParams,
  IUpdateProductPayload,
} from "@/types/product";
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAdminProducts,
  fetchAdminProductById,
} from "@/api/services/product";

//USER HOOKS

// Query hook for fetching all products
export const useFetchProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: (error) => {
      console.error("Fetching products error:", error);
    },
  });
};

// Query hook for fetching a product by ID
export const useFetchProductById = (productId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const cachedProducts = queryClient.getQueryData<{
        products: IProductUser[];
      }>(["products"]);
      const cachedProduct = cachedProducts?.products.find(
        (p) => p._id === productId
      );

      if (cachedProduct) return cachedProduct;

      return fetchProductById(productId);
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Query hook for searching products
export const useProductsSearch = (params: ISearchParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => searchProducts(params),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: (error) => {
      console.error("Caching or refetching product search error:", error);
    },
  });
};

//ADMIN HOOKS
export const useFetchAdminProducts = () => {
  return useQuery({
    queryKey: ["adminProducts"],
    queryFn: fetchAdminProducts,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: (error) => {
      console.error("Fetching products error:", error);
    },
  });
};

// Query hook for fetching a product by ID
export const useFetchAdminProductById = (productId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["adminProducts", productId],
    queryFn: async () => {
      const cachedProducts = queryClient.getQueryData<{
        adminProducts: IProductUser[];
      }>(["adminProducts"]);
      const cachedProduct = cachedProducts?.adminProducts.find(
        (p) => p._id === productId
      );

      if (cachedProduct) return cachedProduct;

      return fetchAdminProductById(productId);
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation hook for creating a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newProduct: ICreateProductPayload) => createProduct(newProduct),
    {
      onSuccess: () => {
        // Invalidate products queries to refetch data
        queryClient.invalidateQueries(["adminProducts"]);
      },
      onError: (error) => {
        console.error("Create product mutation error:", error);
        throw error;
      },
    }
  );
};

// Mutation hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: IUpdateProductPayload }) =>
      updateProduct(id, data),
    {
      // Optimistic Update
      onMutate: async (variables) => {
        // Cancel any ongoing refetches
        await queryClient.cancelQueries(["adminProducts", variables.id]);

        // Get the current cached data
        const previousProduct = queryClient.getQueryData([
          "adminProducts",
          variables.id,
        ]);

        // Optimistically update the cache
        queryClient.setQueryData(
          ["adminProducts", variables.id],
          variables.data
        );

        // Return an object with the previous product
        return { previousProduct };
      },
      onError: (err, variables, context) => {
        // Rollback only if context exists
        if (context?.previousProduct) {
          queryClient.setQueryData(
            ["adminProducts", variables.id],
            context.previousProduct
          );
        }
      },
      onSettled: (_, __, variables) => {
        // Always invalidate queries to ensure fresh data
        queryClient.invalidateQueries(["adminProducts", variables.id]);
        queryClient.invalidateQueries(["adminProducts"]);
      },
    }
  );
};

// Mutation hook for deleting a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteProduct(id), {
    onSuccess: () => {
      // Invalidate products queries to refetch data
      queryClient.invalidateQueries(["adminProducts"]);
    },
    onError: (error) => {
      console.error("Deleting product mutation error:", error);
      throw error;
    },
  });
};
