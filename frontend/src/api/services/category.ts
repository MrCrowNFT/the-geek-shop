import api from "../axios";
import { ICategory } from "@/types/category";

//*don't need to get category by id, since they come with the product

// Fetch all categories
export const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await api.get<{ success: boolean; data: ICategory[] }>(
      "/category/"
    );
    return res.data.data;
  } catch (err) {
    console.error("Fetching categories error:", err);
    throw err;
  }
};

//Admin Only
// Add a new category
export const addCategory = async (category: {
  name: string;
  description?: string;
}): Promise<ICategory> => {
  try {
    const res = await api.post<{ success: boolean; data: ICategory }>(
      "/category/new",
      category
      // No need to manually add token - interceptor handles this
    );
    return res.data.data;
  } catch (err) {
    console.error("Creating category error:", err);
    throw err;
  }
};

// Update category by ID
export const updateCategory = async (
  id: string,
  category: { name?: string; description?: string }
): Promise<ICategory> => {
  try {
    const res = await api.put<{ success: boolean; data: ICategory }>(
      `/category/${id}`,
      category
      // No need to manually add token - interceptor handles this
    );
    return res.data.data;
  } catch (err) {
    console.error("Updating category error:", err);
    throw err;
  }
};

// Delete category by ID
export const deleteCategory = async (id: string) => {
  try {
    const res = await api.delete<{ success: boolean; message: string }>(
      `/category/${id}`
      // No need to manually add token - interceptor handles this
    );
    return res.data;
  } catch (err) {
    console.error("Deleting category error:", err);
    throw err;
  }
};
