import Tracking from "../models/tracking.model.js";
import mongoose from "mongoose";

/**
 * Crates a new tracking document and adds it to the order
 * @route POST /tracking
 * @access Private
 */
export const createTracking = async (req, res) => {
  try {
    const { orderId, carrier, trackingNumber } = req.body;

    if (!orderId | !carrier | !trackingNumber) {
      return res
        .status(400)
        .json({ message: "OrderId, carrier and trackingNumber needed" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const newTracking = new Tracking({
      order: orderId,
      carrier,
      trackingNumber,
      estimatedDelivery,
    });
    //todo need the function that updates order and reference new tracking
    const savedTracking = await newTracking.save();
    res.status(201).json(savedTracking);
  } catch (error) {
    console.error("Error creating tracking:", error);
    res.status(500).json({
      message: "Error creating tracking",
      error: error.message,
    });
  }
};

export const getTrackingById = async (req, res) => {
  try {
    const trackingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(trackingId)) {
      return res.status(400).json({ message: "Invalid tracking ID format" });
    }

    const tracking = Tracking.findById(trackingId);

    res.status(201).json(tracking);
  } catch (error) {
    console.error("Error fetching tracking:", error);
    res.status(500).json({
      message: "Error fetching tracking",
      error: error.message,
    });
  }
};
export const updateTracking = async (req, res) => {
  try {
    const trackingId = req.params.id;
    const updateData = req.body;

    if (!trackingId || !updateData) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    if (!mongoose.Types.ObjectId.isValid(trackingId)) {
      return res.status(400).json({ message: "Invalid tracking ID format" });
    }
    const trackingToUpdate = await Product.findById(trackingId);

    if (!trackingToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Tracking info not found" });
    }
    Object.keys(updateData).forEach((key) => {
      trackingToUpdate[key] = updateData[key];
    });

    //todo make sure this doesn't re calculate the tracking
    const updatedTrackingInfo = await trackingToUpdate.save();
    return res.status(200).json({ success: true, data: updatedTrackingInfo });
  } catch (error) {
    console.error(`Error updating tracking info: ${error.message}`);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Tracking info product ID" });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};
//there is no need for a delete tracking one
