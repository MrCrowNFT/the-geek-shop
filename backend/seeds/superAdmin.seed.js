import mongoose from "mongoose";
import User from "../models/user.model.js";
import connectDb from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "super_admin" });
    if (existingSuperAdmin) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    const superAdmin = new User({
      username: process.env.SUPER_ADMIN_USERNAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "super_admin",
    });
    await superAdmin.save();
    console.log("Super admin created succesfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

const runSeed = async () => {
  try {
    await connectDb();
    await seedSuperAdmin();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

runSeed();
