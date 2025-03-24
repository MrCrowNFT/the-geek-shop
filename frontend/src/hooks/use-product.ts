import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
} from "@/api/services/product";

// Query hook for fetching all products
export const useFetchProducts = () => {
  try {
    const data = useQuery({
      queryKey: ["products"],
      queryFn: fetchProducts,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching products error:", err);
    throw err;
  }
};

// Query hook for fetching a product by ID
export const useFetchProductById = (productId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["order", productId],
    queryFn: async () => {
      //check if the order is on the cached orders, if is not, make the api call
      const cachedProducts = queryClient.getQueryData<{
        products: IProductUser[];
      }>(["orders"]);
      const cachedProduct = cachedProducts?.products.find(
        (p) => p._id === productId
      );

      if (cachedProduct) return cachedProduct;

      return fetchProductById(productId);
    },
    staleTime: 1000 * 60 * 5, // Keep cache fresh for 5 mins
  });
};

// Query hook for searching products
export const useProductsSearch = (params: ISearchParams) => {
  try {
    const data = useQuery({
      queryKey: ["products", params],
      queryFn: () => searchProducts(params),
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching product search error:", err);
    throw err;
  }
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
