import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile_pic: {
      type: String,
      default: "", //if no picture we send an empty string and handle it on the frontend to display a user default img
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "super_admin", "user"],
      default: "user",
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    shipping: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipping", // Reference the `Category` collection
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

//*can't use arrow functions cause i'm using 'this.password'

//we will hash the password before storing it in the database
//so we use the pre middleware hook that runs before saving
userSchema.pre("save", async function (next) {
  try {
    // checks whether the password field has been modified.
    // and only hash the password if is new/modified
    if (!this.isModified("password")) return next();
    // salt 10 is provides good security while still being fast
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    next(error);
  }
});

//compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
