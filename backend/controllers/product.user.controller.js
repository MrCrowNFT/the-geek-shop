import Product from "../module/product.model.js";

export const GetProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const GetProductById = async (req, res) => {
  const { id } = req.params;

  try {
    //new: true so that it returns the updated product
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//this method will be used for product search therefor
//some params in the request query may be empty
export const Search = async (req, res) => {
  try {
    const {
      categories,
      minPrice,
      maxPrice,
      searchTerm,
      page = 1,
      limit = 20, //20 products per page
    } = req.query;

    //we'll use a dynamic query
    const query = {};

    if (categories) {
      const categoriesIds = categories.split(","); //Parse coma separeted values
      query.category = { $in: categoriesIds }; // filter
    }

    if (minPrice || maxPrice) {
      query.priceTag = {};
      if (minPrice) query.priceTag.$gte = Number(minPrice);
      if (maxPrice) query.priceTag.$lte = Number(maxPrice);
    }

    // Text search (if searchTerm is provided)
    if (searchTerm) {
      query.$text = { $search: searchTerm }; // MongoDB text search
    }

    // Convert page and limit to numbers, base 10
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber; // Calculate the number of documents to skip

    //populate to get the full product data
    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(limitNumber);

    //get total num of products returns for pagination
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
        totalProducts, //total amount of products
        totalPages: Math.ceil(totalProducts / limitNumber), //total amount of pages
        currentPage: pageNumber, // current page
        productsPerPage: limitNumber, // number of products per page
      },
    });
  } catch (error) {
    console.error(`Error during product search: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
