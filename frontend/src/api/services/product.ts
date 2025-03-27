import api from "../axios";
import {
  IProductUser,
  IPaginatedResponse,
  ICreateProductPayload,
  IUpdateProductPayload,
  ISearchParams,
} from "@/types/product";

//User calls

// Fetch all products
export const fetchProducts = async (): Promise<IProductUser[]> => {
  try {
    const res = await api.get<{
      success: boolean;
      data: IProductUser[];
    }>("/product/");
    return res.data.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

//todo: the main problem with this approach is that i am just ignoring the message that is sent from the api
// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<IProductUser> => {
  try {
    const res = await api.get<{ success: boolean; data: IProductUser }>(
      `/product/${id}`
    );
    return res.data.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

// Search for products with filters
export const searchProducts = async (
  params: ISearchParams
): Promise<IPaginatedResponse> => {
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
export const createProduct = async (newProduct: ICreateProductPayload) => {
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
  newProduct: IUpdateProductPayload
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
