import Order from "../models/order.model.js";
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
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid order ID format" });
  }

  try {
    // First find the order
    const orderToUpdate = await Order.findById(id);

    if (!orderToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (key === "shipping" && updateData.shipping) {
        orderToUpdate.shipping = mongoose.Types.ObjectId(updateData.shipping);
      } else if (key === "tracking" && updateData.tracking) {
        orderToUpdate.tracking = mongoose.Types.ObjectId(updateData.tracking);
      } else {
        // For other fields
        orderToUpdate[key] = updateData[key];
      }
    });

    // Save to trigger any middleware
    const updatedOrder = await orderToUpdate.save();

    return res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error(`Error updating order: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
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

//todo add to router
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
