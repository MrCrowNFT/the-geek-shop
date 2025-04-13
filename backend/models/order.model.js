import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    //for biderectiona reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipping",
    },
    tracking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tracking",
    },

    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId, // Reference to Product
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    paid_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "OnRoute", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
