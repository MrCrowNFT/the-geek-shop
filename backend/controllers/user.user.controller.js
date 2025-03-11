import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * Get user profile
 * @route GET /users/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("orders")
      .populate("shipping")
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

/**
 * Update user profile
 * @route PUT /users/profile
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, password } = req.body;

    // Find user first
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username already exists
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    // Check if email already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      user.password = password; // Will be hashed by the pre-save hook
    }

    // Save updated user
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

/**
 * Delete user account
 * @route DELETE /users/profile
 * @access Private
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user first
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has any orders
    if (user.orders && user.orders.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete account with existing orders. Please contact support.",
        orderCount: user.orders.length,
      });
    }

    // Delete related shipping addresses
    if (user.shipping && user.shipping.length > 0) {
      // You might want to actually delete the shipping records here
      // For now, we're just warning about them
      console.log(
        `Deleting user with ${user.shipping.length} shipping addresses`
      );
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res
      .status(500)
      .json({ message: "Error deleting user account", error: error.message });
  }
};

/**
 * Add product to wishlist
 * @route POST /users/wishlist
 * @access Private
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } }, // Use addToSet to prevent duplicates
      { new: true }
    ).populate("wishlist");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: error.message });
  }
};

/**
 * Remove product from wishlist
 * @route DELETE /users/wishlist/:productId
 * @access Private
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: error.message });
  }
};

/**
 * Get user wishlist
 * @route GET /users/wishlist
 * @access Private
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("wishlist")
      .select("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: error.message });
  }
};
