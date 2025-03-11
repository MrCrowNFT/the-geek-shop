import Product from "../module/product.model.js";

export const newProduct = async (req, res) => {
  try {
    const {
      name,
      total_cost,
      discount,
      sku,
      isAvailable,
      images,
      description,
      category,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !total_cost?.cost ||
      !total_cost?.shipping ||
      isAvailable === undefined ||
      !images?.length
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res
          .status(400)
          .json({ success: false, message: "SKU already exists" });
      }
    }

    // Convert category IDs to ObjectId if provided
    const categoryIds = category?.length
      ? category.map((id) => mongoose.Types.ObjectId(id))
      : [];

    // Create and save product
    const newProduct = new Product({
      name,
      total_cost,
      discount,
      sku,
      isAvailable,
      images,
      description,
      category: categoryIds,
    });

    await newProduct.save();

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  try {
    if (!id || !product) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Convert category to ObjectId if updated
    if (product.category?.length) {
      product.category = product.category.map((id) =>
        mongoose.Types.ObjectId(id)
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
