import axios from "axios";
import { ICategories } from "@/types/category";

const API_URL = "http://localhost:5500/category";

// Fetch all categories
export const fetchCategories = async (): Promise<{
  success: boolean;
  data: ICategories;
}> => {
  try {
    const res = await axios.get<{ success: boolean; data: ICategories }>(
      `${API_URL}/`
    );
    return res.data;
  } catch (err) {
    console.error("Fetching categories error:", err);
    throw err;
  }
};

//For Admin Only

// Add a new category
export const addCategory = async (
  category: { name: string; description?: string },
  token: string //todo, is there an easyer way to send it without inputing the token?
) => {
  try {
    const res = await axios.post<{ success: boolean; data: ICategories }>(
      `${API_URL}/new`,
      category,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Creating category error:", err);
    throw err;
  }
};

// Update category by ID
export const updateCategory = async (
  id: string,
  category: { name?: string; description?: string },
  token: string
) => {
  try {
    const res = await axios.put<{ success: boolean; data: ICategories }>(
      `${API_URL}/${id}`,
      category,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Updating category error:", err);
    throw err;
  }
};

// Delete category by ID
export const deleteCategory = async (id: string, token: string) => {
  try {
    const res = await axios.delete<{ success: boolean; message: string }>(
      `${API_URL}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Deleting category error:", err);
    throw err;
  }
};
