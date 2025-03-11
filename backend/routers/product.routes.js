import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    priceTag: {
      type: Number,
      required: true,
      min: 0,
    },
    total_cost: {
      cost: { type: Number, required: true },
      shipping: { type: Number, required: true },
    },
    discount: {
      amount: { type: Number, default: 0 },
      status: { type: Boolean, default: false },
    },
    //sku for google analytics
    sku: {
      type: Number,
      unique: true,
      required: false,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    images: [
      {
        //have url of the image
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: false,
      maxlength: 500,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference the `Category` collection
      },
    ],
    likesCount: { type: Number, default: 0 }, // Tracks likes
    salesCount: { type: Number, default: 0 }, // Tracks sales
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
);

productSchema.pre("save", function (next) {
  const taxRate = 0.19;
  const profit = 0.1;
  const totalCost = this.total_cost.cost + this.total_cost.shipping;
  const discount = this.discount.status ? this.discount.amount : 0;
  const basePrice = totalCost + totalCost * taxRate + totalCost * profit;

  //ensure priceTag is not less than total cost or greater than base price
  this.priceTag = Math.max(totalCost, basePrice - discount);
  next();
});

productSchema.pre("save", async function (next) {
  try {
    if (this.category && this.category.length > 0) {
      this.category = [...new Set(this.category.map((c) => c.toString()))].map(
        (c) => mongoose.Types.ObjectId(c)
      );

      // find all categories in one query
      const categories = await mongoose.model("Category").find({
        _id: { $in: this.category },
      });

      // check if they exists
      if (categories.length !== this.category.length) {
        const foundIds = categories.map((c) => c._id.toString());
        const invalidIds = this.category
          .map((c) => c.toString())
          .filter((id) => !foundIds.includes(id));

        throw new Error(`Invalid category IDs: ${invalidIds.join(", ")}`);
      }
    } else {
      throw new Error("At least one category is required");
    }
    next();
  } catch (error) {
    next(error);
  }
});

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
