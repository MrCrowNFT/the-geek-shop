import Category from "../module/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    //check if req has name
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    //check for dups
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    //create the new category
    const newCategory = new Category({ name, description });
    await newCategory.save();
    return res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    console.error(`Error adding category: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error(`Error updating category: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Error deleting category: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
