import axios from "axios";
import { IProductUser } from "@/types/product";

const API_URL = "http://localhost:5500/product";

// pagination response type
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

//For User
// Fetch all products
export const fetchProducts = async (): Promise<{
  success: boolean;
  data: IProductUser[];
}> => {
  try {
    const res = await axios.get<{
      success: boolean;
      data: IProductUser[];
    }>(`${API_URL}/`);
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
    const res = await axios.get<{ success: boolean; data: IProductUser }>(
      `${API_URL}/${id}`
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
}): Promise<PaginatedResponse> => {
  try {
    const res = await axios.get<PaginatedResponse>(`${API_URL}/search`, {
      params,
    });
    return res.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};
