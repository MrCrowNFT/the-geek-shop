import api from "../axios";
import { IProductUser, IPaginatedResponse } from "@/types/product";

//User calls

// Fetch all products
export const fetchProducts = async () => {
  try {
    const res = await api.get<{
      success: boolean;
      data: IProductUser[];
    }>("/product/");
    return res.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (
  id: string
): Promise<{ success: boolean; data: IProductUser }> => {
  try {
    const res = await api.get<{ success: boolean; data: IProductUser }>(
      `/product/${id}`
    );
    return res.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

// Search for products with filters
export const searchProducts = async (params: {
  categories?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
}): Promise<IPaginatedResponse> => {
  try {
    const res = await api.get<IPaginatedResponse>("/product/search", {
      params,
    });
    return res.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

//Admin Only
export const createProduct = async (newProduct: {
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
  categories: string[];
}) => {
  try {
    const res = await api.post("/product/new", newProduct);
    return res.data;
  } catch (err) {
    console.error("Creating new product error:", err);
    throw err;
  }
};

export const updateProduct = async (
  id: string,
  newProduct: {
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
) => {
  try {
    const res = await api.put(`/product/${id}`, newProduct);
    return res.data;
  } catch (err) {
    console.error("Updating product error:", err);
    throw err;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data;
  } catch (err) {
    console.error("Deleting product error:", err);
    throw err;
  }
};
