import Order from "../module/order.model.js";
import mongoose from "mongoose";

//ORDERS ADMIN FUNCTIONS
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(`Error fetching orders: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(`Error fetching orders: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const order = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, {
      new: true,
    });
    return res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error(`Error updating orders: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const orderSearch = async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 20 } = req.query;

    const query = {};

    query.$text = { $search: searchTerm }; // MongoDB text search

    // Convert page and limit to numbers, base 10
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber; // Calculate the number of documents to skip

    const orders = await Order.find(query).skip(skip).limit(limitNumber);

    const totalOrders = await Order.countDocuments(query);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found matching the search criteria.",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limitNumber),
        currentPage: pageNumber,
        productPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error(`Error during order search: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//function for the dashboard
export const getRecentOrders = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } })
      .populate("user")
      .populate("shipping")
      .populate("products.id")
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(`Error getting orders: ${error.message}`);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//missing a delete method
//TODO add a way so that pending orders get deleted automatically after a time
