import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { IProductUser } from "@/types/product";
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/services/product";

// Type for the paginated response
interface PaginatedResponse {
  success: boolean;
  data: IProductUser[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    productsPerPage: number;
  };
}

// Type for create product payload
interface CreateProductPayload {
  name: string;
  total_cost: {
    cost: number;
    shipping: number;
  };
  discount?: {
    amount: number;
    status: boolean;
  };
  sku?: string;
  isAvailable: boolean;
  images: string;
  description?: string;
  category: string[];
}

// Type for update product payload
interface UpdateProductPayload {
  name?: string;
  total_cost?: {
    cost?: number;
    shipping?: number;
  };
  discount?: {
    amount?: number;
    status?: boolean;
  };
  sku?: string;
  isAvailable?: boolean;
  images?: string;
  description?: string;
  category?: string[];
}

// Type for search params
interface SearchParams {
  categories?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

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
    (newProduct: CreateProductPayload) => createProduct(newProduct),
    {
      onSuccess: () => {
        // Invalidate products queries to refetch data
        queryClient.invalidateQueries(["products"]);
      },
    }
  );
};

// Mutation hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: string; data: UpdateProductPayload }) =>
      updateProduct(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate specific product query and products list
        queryClient.invalidateQueries(["product", variables.id]);
        queryClient.invalidateQueries(["products"]);
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
  });
};
