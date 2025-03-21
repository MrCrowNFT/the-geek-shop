import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    carrier: {
      type: String, 
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  { timestamps: true }
);
//todo, add a pre save hook that calculates the estimated delivery

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
