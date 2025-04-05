import mongoose from "mongoose";
import Product from "../module/product.model.js";
import { sanitizeProduct } from "../helpers/product.helpers.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    //sanitize products so that we don't send the total_cost since that's business logic
    const sanitizedProducts = products.map((product) =>
      sanitizeProduct(product)
    );
    return res.status(200).json({ success: true, data: sanitizedProducts });
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

    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const sanitizedProduct = sanitizeProduct(product);
    return res.status(200).json({ success: true, data: sanitizedProduct });
  } catch (error) {
    console.error(`Error fetching product by ID: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//this method will be used for product search therefor
//some params in the request query may be empty
export const productSearch = async (req, res) => {
  try {
    const { categories, minPrice, maxPrice, searchTerm, page, limit, sortBy } =
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

    // Define sort options
    let sortOptions = {};

    // Handle different sort criteria
    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "likes":
        sortOptions = { likesCount: -1 };
        break;
      case "no-likes":
        sortOptions = { likesCount: 1 };
        break;
      case "popular":
        // Combined popularity based on likes and sales
        sortOptions = {
          salesCount: -1, // Higher priority to sales
          likesCount: -1, // Then by likes
        };
        break;
      case "unpopular":
        sortOptions = {
          salesCount: 1,
          likesCount: 1,
        };
        break;
      case "bestselling":
        sortOptions = { salesCount: -1 };
        break;
      // Default to newest
      default:
        sortOptions = { createdAt: -1 };
    }

    // Fetch products with pagination
    const products = await Product.find(query)
      .populate("category")
      .sort(sortOptions)
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

    const sanitizedProducts = products.map((product) =>
      sanitizeProduct(product)
    );

    res.status(200).json({
      success: true,
      data: sanitizedProducts,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNumber),
        currentPage: pageNumber,
        productsPerPage: limitNumber,
      },
      sorted: sortBy || "newest",
    });
  } catch (error) {
    console.error(`Error during product search: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
