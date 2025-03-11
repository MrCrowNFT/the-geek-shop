import Product from "../module/product.model.js";

export const newProduct = async (req, res) => {
    try {
      const {
        name,
        priceTag,
        total_cost,
        discount,
        sku,
        urls,
        isAvailable,
        images,
        description,
        category,
      } = req.body;
  
      if (
        !name ||
        !total_cost?.cost ||
        !total_cost?.shipping ||
        !isAvailable ||
        !images?.length
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
  
      if (sku) {
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
          return res
            .status(400)
            .json({ success: false, message: "SKU already exists" });
        }
      }
  
      const newProduct = new Product({
        name,
        priceTag,
        total_cost,
        discount,
        sku,
        urls,
        isAvailable,
        images,
        description,
        category,
      });
  
      await newProduct.save();
      //201 means smth created
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
    //to get whatever admin wants to update
    const product = req.body;
  
    try {
      if (!id || !product) {
        return res.status(400).json({ success: false, message: "Invalid input" });
      }
  
      //new: true so that it returns the updated product
      const updatedProduct = await Product.findByIdAndUpdate(id, product, {
        new: true,
      });
      //to catch 404 case
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
  