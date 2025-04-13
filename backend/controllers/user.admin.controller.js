import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Create a new admin user
 * @route POST /admin
 * @access Private (Super Admin only)
 */
export const createAdmin = async (req, res) => {
  try {
    // Check if the requestor is a super_admin
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Not authorized. Super admin access required." });
    }

    const { username, email, password, role = "admin" } = req.body;

    // Validate role is either admin or super_admin
    if (role !== "admin" && role !== "super_admin") {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'admin' or 'super_admin'" });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new admin user
    const newAdmin = new User({
      username,
      email,
      password, // Will be hashed by the pre-save hook
      role,
    });

    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      _id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      role: savedAdmin.role,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res
      .status(500)
      .json({ message: "Error creating admin", error: error.message });
  }
};

/**
 * Get all admins
 * @route GET /admin
 * @access Private (Super Admin only)
 */
export const getAllAdmins = async (req, res) => {
  try {
    // Check if the requestor is a super_admin
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Not authorized. Super admin access required." });
    }

    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] },
    }).select("-password");

    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

/**
 * Get admin by ID
 * @route GET /admin/:id
 * @access Private (Super Admin only)
 */
export const getAdminById = async (req, res) => {
  try {
    // Check if the requestor is a super_admin
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Not authorized. Super admin access required." });
    }

    const adminId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID format" });
    }

    const admin = await User.findOne({
      _id: adminId,
      role: { $in: ["admin", "super_admin"] },
    }).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
};

/**
 * Update admin
 * @route PUT /admin/:id
 * @access Private (Super Admin only)
 */
export const updateAdmin = async (req, res) => {
  try {
    // Check if the requestor is a super_admin
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Not authorized. Super admin access required." });
    }

    const adminId = req.params.id;
    const { username, email, password, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID format" });
    }

    // Find admin first
    const admin = await User.findOne({
      _id: adminId,
      role: { $in: ["admin", "super_admin"] },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Validate role is either admin or super_admin
    if (role && role !== "admin" && role !== "super_admin") {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'admin' or 'super_admin'" });
    }

    // Check if username already exists
    if (username && username !== admin.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
      admin.username = username;
    }

    // Check if email already exists
    if (email && email !== admin.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      admin.email = email;
    }

    // Update password if provided
    if (password) {
      admin.password = password; // Will be hashed by the pre-save hook
    }

    // Update role if provided
    if (role) {
      admin.role = role;
    }

    // Save updated admin
    const updatedAdmin = await admin.save();

    res.status(200).json({
      _id: updatedAdmin._id,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res
      .status(500)
      .json({ message: "Error updating admin", error: error.message });
  }
};

/**
 * Delete admin
 * @route DELETE /admin/:id
 * @access Private (Super Admin only)
 */
export const deleteAdmin = async (req, res) => {
  try {
    // Check if the requestor is a super_admin
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Not authorized. Super admin access required." });
    }

    const adminId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID format" });
    }

    // Prevent super_admin from deleting themselves
    if (adminId.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own super admin account" });
    }

    // Find and delete admin
    const deletedAdmin = await User.findOneAndDelete({
      _id: adminId,
      role: { $in: ["admin", "super_admin"] },
    });

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};
