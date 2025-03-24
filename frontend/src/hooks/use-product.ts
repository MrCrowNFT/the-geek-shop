import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  ICreateProductPayload,
  IProductUser,
  IUpdateProductPayload,
} from "@/types/product";
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/services/product";

// Query hook for fetching all products
export const useProducts = (
  options?: UseQueryOptions<{ success: boolean; data: IProductUser[] }>
) => {
  return useQuery(["products"], fetchProducts, options);
};

// Query hook for fetching a product by ID
export const useProduct = (
  id: string,
  options?: UseQueryOptions<{ success: boolean; data: IProductUser }>
) => {
  return useQuery(["product", id], () => fetchProductById(id), {
    enabled: !!id,
    ...options,
  });
};

// Query hook for searching products
export const useSearchProducts = (
  params: SearchParams,
  options?: UseQueryOptions<PaginatedResponse>
) => {
  return useQuery(
    ["products", "search", params],
    () => searchProducts(params),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

// Mutation hook for creating a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newProduct: ICreateProductPayload) => createProduct(newProduct),
    {
      onSuccess: () => {
        // Invalidate products queries to refetch data
        queryClient.invalidateQueries(["products"]);
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
      onSuccess: (_, variables) => {
        // Invalidate specific product query and products list
        queryClient.invalidateQueries(["product", variables.id]);
        queryClient.invalidateQueries(["products"]);
      },
      onError: (error) => {
        console.error("Updating product mutation error:", error);
        throw error;
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
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Deleting product mutation error:", error);
      throw error;
    },
  });
};
