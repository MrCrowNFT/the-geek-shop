import mongoose from "mongoose";
import Product from "../module/product.model.js";

//todo: need to skip the product cost when sending the products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
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

//this method will be used for product search therefor
//some params in the request query may be empty
export const productSearch = async (req, res) => {
  try {
    const { categories, minPrice, maxPrice, searchTerm, page, limit } =
      req.query;

    const query = {}; //dynami query

    // Convert categories to ObjectId array
    if (categories) {
      const categoryIds = categories
        .split(",")
        .map((id) => mongoose.Types.ObjectId(id));
      query.category = { $in: categoryIds };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      query.priceTag = {};
      if (minPrice) query.priceTag.$gte = Number(minPrice);
      if (maxPrice) query.priceTag.$lte = Number(maxPrice);
    }

    // Text search (ensure a text index exists in the model)
    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }

    // Pagination handling
    const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch products with pagination
    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(limitNumber);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found matching the search criteria.",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNumber),
        currentPage: pageNumber,
        productsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error(`Error during product search: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
