import Shipping from "../models/Shipping.js";
import mongoose from "mongoose";

/**
 * Create a new shipping address
 * @route POST /shipping/new
 * @access Private
 */
export const createShipping = async (req, res) => {
  try {
    const { name, phone, run, address, region, indications } = req.body;
    const userId = req.user._id; // Assuming you have user data from auth middleware

    // Create new shipping address
    const newShipping = new Shipping({
      user: userId,
      name,
      phone,
      run,
      address,
      region,
      indications: indications || "",
    });

    const savedShipping = await newShipping.save();
    res.status(201).json(savedShipping);
  } catch (error) {
    console.error("Error creating shipping address:", error);
    res
      .status(500)
      .json({
        message: "Error creating shipping address",
        error: error.message,
      });
  }
};

/**
 * Get all shipping addresses for a user
 * @route GET /shipping/
 * @access Private
 */
export const getUserShippingAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const shippingAddresses = await Shipping.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(shippingAddresses);
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    res
      .status(500)
      .json({
        message: "Error fetching shipping addresses",
        error: error.message,
      });
  }
};

/**
 * Get a shipping address by ID
 * @route GET /shipping/:id
 * @access Private
 */
export const getShippingById = async (req, res) => {
  try {
    const shippingId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(shippingId)) {
      return res.status(400).json({ message: "Invalid shipping ID format" });
    }

    const shipping = await Shipping.findById(shippingId).populate("orders");

    if (!shipping) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    // Verify shipping belongs to this user
    if (shipping.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this shipping address" });
    }

    res.status(200).json(shipping);
  } catch (error) {
    console.error("Error fetching shipping address:", error);
    res
      .status(500)
      .json({
        message: "Error fetching shipping address",
        error: error.message,
      });
  }
};

/**
 * Update a shipping address
 * @route PUT /shipping/:id
 * @access Private
 */
export const updateShipping = async (req, res) => {
  try {
    const shippingId = req.params.id;
    const userId = req.user._id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(shippingId)) {
      return res.status(400).json({ message: "Invalid shipping ID format" });
    }

    // Find shipping address first to verify ownership
    const shipping = await Shipping.findById(shippingId);

    if (!shipping) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    // Verify shipping belongs to this user
    if (shipping.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this shipping address" });
    }

    // Don't allow changing the user reference
    delete updates.user;
    delete updates.orders; // Don't allow direct manipulation of the orders array

    const updatedShipping = await Shipping.findByIdAndUpdate(
      shippingId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedShipping);
  } catch (error) {
    console.error("Error updating shipping address:", error);
    res
      .status(500)
      .json({
        message: "Error updating shipping address",
        error: error.message,
      });
  }
};

/**
 * Delete a shipping address
 * @route DELETE /shipping/:id
 * @access Private
 */
export const deleteShipping = async (req, res) => {
  try {
    const shippingId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(shippingId)) {
      return res.status(400).json({ message: "Invalid shipping ID format" });
    }

    // Find shipping address first to verify ownership
    const shipping = await Shipping.findById(shippingId);

    if (!shipping) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    // Verify shipping belongs to this user
    if (shipping.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this shipping address" });
    }

    // Check if shipping address is associated with any orders
    if (shipping.orders && shipping.orders.length > 0) {
      return res.status(400).json({
        message: "Cannot delete shipping address associated with orders",
        orderCount: shipping.orders.length,
      });
    }

    await Shipping.findByIdAndDelete(shippingId);

    res.status(200).json({ message: "Shipping address deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    res
      .status(500)
      .json({
        message: "Error deleting shipping address",
        error: error.message,
      });
  }
};
