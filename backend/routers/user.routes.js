import express from "express";
import {
  authenticate,
  verifyAdmin,
  verifySuperAdmin,
} from "../middleware/auth.js";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdmins,
  updateAdmin,
} from "../controllers/user.admin.controller.js";
import {
  addToWishlist,
  deleteUserAccount,
  getUserProfile,
  getWishlist,
  removeFromWishlist,
  updateUserProfile,
} from "../controllers/user.user.controller.js";

const userRouter = express.Router();

//user routes
userRouter.get("/users/profile/", authenticate, getUserProfile);
userRouter.put("/users/profile/", authenticate, updateUserProfile);
userRouter.delete("/users/profile/", authenticate, deleteUserAccount);

//user wishlist
userRouter.post("/wishlist/", authenticate, addToWishlist);
userRouter.get("/wishlist/", authenticate, getWishlist);
userRouter.delete(
  "/wishlist/:productId",
  authenticate,
  removeFromWishlist
);

//admin routes
userRouter.post(
  "/admin",
  authenticate,
  verifyAdmin,
  verifySuperAdmin,
  createAdmin
);
userRouter.get("/admin", authenticate, verifyAdmin, getAllAdmins);
userRouter.get("/admin/:id", authenticate, verifyAdmin, getAdminById);
userRouter.put("/admin/:id", authenticate, verifyAdmin, updateAdmin);
userRouter.delete(
  "/admin/:id",
  authenticate,
  verifyAdmin,
  verifySuperAdmin,
  deleteAdmin
);

export default userRouter;
