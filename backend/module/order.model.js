import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    //for biderectiona reference with user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipping",
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

const Category = mongoose.model("Order", orderSchema);

export default Category;
