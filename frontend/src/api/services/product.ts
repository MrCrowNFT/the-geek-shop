import api from "../axios";
import {
  IProductUser,
  IPaginatedResponse,
  ICreateProductPayload,
  IUpdateProductPayload,
  ISearchParams,
  IProductAdmin,
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
    const res = await api.get<IPaginatedResponse>("/product/search/", {
      params,
    });
    return res.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

//Admin Only

export const fetchAdminProducts = async (): Promise<IProductAdmin[]> => {
  try {
    const res = await api.get<{
      success: boolean;
      data: IProductAdmin[];
    }>("/product/admin/");
    return res.data.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

export const fetchAdminProductById = async (
  id: string
): Promise<IProductAdmin> => {
  try {
    const res = await api.get<{ success: boolean; data: IProductAdmin }>(
      `/product/admin/${id}`
    );
    return res.data.data;
  } catch (err) {
    console.error("Fetching products error:", err);
    throw err;
  }
};

export const createProduct = async (newProduct: ICreateProductPayload) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append all non-file fields
    formData.append('name', newProduct.name);
    formData.append('priceTag', newProduct.priceTag.toString());
    formData.append('total_cost', JSON.stringify(newProduct.total_cost));
    formData.append('isAvailable', newProduct.isAvailable.toString());
    
    if (newProduct.discount) {
      formData.append('discount', JSON.stringify(newProduct.discount));
    }
    if (newProduct.sku) {
      formData.append('sku', newProduct.sku);
    }
    if (newProduct.description) {
      formData.append('description', newProduct.description);
    }
    if (newProduct.category.length > 0) {
      formData.append('category', JSON.stringify(newProduct.category));
    }
    
    // Append image files
    newProduct.images.forEach((file) => {
      formData.append('images', file);
    });

    const res = await api.post("/product/admin/new", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Creating new product error:", err);
    throw err;
  }
};

//todo update this as the one above
export const updateProduct = async (
  id: string,
  newProduct: IUpdateProductPayload
) => {
  try {
    const res = await api.put(`/product/admin/${id}`, newProduct);
    return res.data;
  } catch (err) {
    console.error("Updating product error:", err);
    throw err;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`/product/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error("Deleting product error:", err);
    throw err;
  }
};
