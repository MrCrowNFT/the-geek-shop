import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { uploadImageToS3 } from "../utils/s3Uploader.js";

//get the products without sanitizing them
export const getAdminProducts = async (req, res) => {
  try {
    console.log("fetching admin products")
    const products = await Product.find({});
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAdminProductById = async (req, res) => {
  console.log("getting admin product by id")
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`Error fetching product by ID: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//todo, might need a search product function, as of now, i am just using a front end search

export const newProduct = async (req, res) => {
  console.log("Creating new product...");
  try {
    const {
      name,
      priceTag,
      total_cost,
      discount,
      sku,
      isAvailable,
      description,
      category,
    } = req.body;
    const file = req.files;//get the images
    console.log(`New product values extracted: ${req.body}`);

    // Validate required fields
    if (
      !name ||
      !total_cost?.cost ||
      !total_cost?.shipping ||
      isAvailable === undefined ||
      priceTag === undefined
    ) {
      console.log("new product missing fields");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    console.log("new product validated");

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

      //each img is uploaded to the aws s3 bucket
    const imageUrls = await Promise.all(
      files.map(file=>uploadImageToS3(file))
    );

    // Create and save product
    const newProduct = new Product({
      name,
      priceTag,
      total_cost,
      discount,
      sku,
      isAvailable,
      images: imageUrls,
      description,
      category: categoryIds,
    });
    console.log(`New product created: ${newProduct}`);

    await newProduct.save();
    console.log("New product saved on database");

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//need a function to also delete the images from the s3 bucket
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
  const updateData = req.body;

  try {
    if (!id || !updateData) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    //  find the product
    const productToUpdate = await Product.findById(id);

    if (!productToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update the product fields
    Object.keys(updateData).forEach((key) => {
      if (key === "category" && updateData.category?.length) {
        // category conversion specially as i'll be sending a string
        productToUpdate.category = updateData.category.map((id) =>
          typeof id === "string" ? mongoose.Types.ObjectId(id) : id
        );
      } else if (key === "total_cost") {
        // Handle nested objects
        productToUpdate.total_cost.cost =
          updateData.total_cost.cost || productToUpdate.total_cost.cost;
        productToUpdate.total_cost.shipping =
          updateData.total_cost.shipping || productToUpdate.total_cost.shipping;
      } else if (key === "discount") {
        // Handle nested objects
        productToUpdate.discount.amount =
          updateData.discount.amount !== undefined
            ? updateData.discount.amount
            : productToUpdate.discount.amount;
        productToUpdate.discount.status =
          updateData.discount.status !== undefined
            ? updateData.discount.status
            : productToUpdate.discount.status;
      } else {
        // For other fields
        productToUpdate[key] = updateData[key];
      }
    });

    // Save the product to trigger the pre-save hooks
    const updatedProduct = await productToUpdate.save();

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};
