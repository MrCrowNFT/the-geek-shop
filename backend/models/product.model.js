import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    priceTag: { type: Number, required: true, min: 0 },

    total_cost: {
      cost: { type: Number, required: true },
      shipping: { type: Number, required: true },
    },

    discount: {
      amount: { type: Number, default: 0 },
      status: { type: Boolean, default: false },
    },

    sku: {
      type: String, // String for better flexibility since some might have letters
      unique: true,
      required: false,
    },

    isAvailable: { type: Boolean, required: true },

    images: [{ type: String }],//we will store the url

    description: { type: String, maxlength: 500 },

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: [], // No category required initially
      },
    ],

    likesCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  try {
    // Calculate total cost with tax
    const taxRate = 0.19;
    const totalCostWithTax =
      this.total_cost.cost +
      this.total_cost.shipping +
      (this.total_cost.cost + this.total_cost.shipping) * taxRate;

    // case 1: price tag with discount > totalCostWithTax
    const priceAfterDiscount =
      this.priceTag - (this.discount.status ? this.discount.amount : 0);
    if (priceAfterDiscount >= totalCostWithTax) {
      // no changes needed
      return next();
    }
    // case 2: price tag with discount < totalCostWithTax
    //  try disabling discount
    const priceWithoutDiscount = this.priceTag;
    if (priceWithoutDiscount >= totalCostWithTax) {
      // disable discount
      this.discount.status = false;
      this.discount.amount = 0;
      return next();
    }

    // if still not enough just set price tag to total cost + tax
    this.priceTag = totalCostWithTax;
    this.discount.status = false;
    this.discount.amount = 0;

    // Validate categories if they exist
    if (this.category && this.category.length > 0) {
      this.category = [...new Set(this.category.map((c) => c.toString()))].map(
        (c) => mongoose.Types.ObjectId(c)
      );

      const categories = await mongoose.model("Category").find({
        _id: { $in: this.category },
      });

      if (categories.length !== this.category.length) {
        const foundIds = categories.map((c) => c._id.toString());
        const invalidIds = this.category
          .map((c) => c.toString())
          .filter((id) => !foundIds.includes(id));

        throw new Error(`Invalid category IDs: ${invalidIds.join(", ")}`);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Text index for search
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
