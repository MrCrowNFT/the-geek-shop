import Order from "../models/Order.js";
import Shipping from "../models/Shipping.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * Create a new order
 * @route POST /orders/new
 * @access Private -- For logged user
 */
export const createOrder = async (req, res) => {
  try {
    const { shipping, products, paid_amount } = req.body;
    const userId = req.user._id; // user data from auth middleware

    // Validate shipping address exists
    const shippingAddress = await Shipping.findById(shipping);
    if (!shippingAddress) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    // Verify shipping address belongs to this user
    if (shippingAddress.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to use this shipping address" });
    }

    // Validate products exist and have sufficient inventory
    const productIds = products.map((product) => product.id);
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    if (existingProducts.length !== productIds.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found" });
    }

    // Create the order
    const newOrder = new Order({
      user: userId,
      shipping,
      products,
      paid_amount,
      status: "Pending", // Default status
    });

    const savedOrder = await newOrder.save();

    // Populate product information for the response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("user", "name email")
      .populate("shipping")
      .populate("products.id");

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

/**
 * Get all orders for a specific user
 * @route GET /orders/
 * @access Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user data from auth middleware

    const orders = await Order.find({ user: userId })
      .populate("shipping", "address city state zipCode country")
      .populate("products.id", "name price image")
      .sort({ createdAt: -1 }); // Most recent orders first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

/**
 * Cancel an order
 * @route PUT /orders/:id/cancel
 * @access Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id; // Assuming you have user data from auth middleware

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to this user
    if (order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Check if order is already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // Check if order is beyond cancellation period (12 hours)
    if (order.status === "Paid") {
      const paidAt = order.updatedAt; // updatedAt set when status changed to Paid
      const currentTime = new Date();
      const hoursDifference = (currentTime - paidAt) / (1000 * 60 * 60);

      if (hoursDifference > 12) {
        return res.status(400).json({
          message: "Order cannot be cancelled after 12 hours of payment",
          hoursPassed: hoursDifference,
        });
      }
    } else if (["OnRoute", "Delivered"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel order in '${order.status}' status`,
      });
    }

    // Update order status to cancelled
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};

//todo: do i really know this? the shipping id will be added to the order after the shipping is 
//todo: created, therefor, this isn't really necessary
/**
 * Add order reference to shipping address
 * @param {string} shippingId - The ID of the shipping address
 * @param {string} orderId - The ID of the order to add
 * @returns {Promise<Object>} - Result with success status and message
 */
export const addOrderToShipping = async (shippingId, orderId) => {
    try {
      // Find both the shipping address and order
      const shipping = await Shipping.findById(shippingId);
      const order = await Order.findById(orderId);
  
      // Check if both exist
      if (!shipping || !order) {
        return { 
          success: false, 
          message: !shipping ? "Shipping address not found" : "Order not found" 
        };
      }
  
      // Verify that both belong to the same user
      if (shipping.user.toString() !== order.user.toString()) {
        return { 
          success: false, 
          message: "Order and shipping address do not belong to the same user" 
        };
      }
  
      // Add the order to the shipping address
      await Shipping.findByIdAndUpdate(
        shippingId,
        { $addToSet: { orders: orderId } }, // $addToSet prevents duplicates
        { new: true }
      );
  
      return { success: true, message: "Order added to shipping address successfully" };
    } catch (error) {
      console.error("Error adding order to shipping:", error);
      return { success: false, message: error.message };
    }
  };