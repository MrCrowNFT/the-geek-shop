import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    //reference to the user id
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    //info for shipping
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    run: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    indications: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Shipping", shippingSchema);

export default Category;
