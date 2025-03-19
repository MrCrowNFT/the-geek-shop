import express from "express";
import {
  authenticate,
  verifyAdmin,
  verifySuperAdmin,
} from "../middleware/auth";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdmins,
  updateAdmin,
} from "../controllers/user.admin.controller";
import {
  addToWishlist,
  deleteUserAccount,
  getUserProfile,
  getWishlist,
  removeFromWishlist,
  updateUserProfile,
} from "../controllers/user.user.controller";

const userRouter = express.Router();

//user routes
userRouter.get("/users/profile/:id", authenticate, getUserProfile);
userRouter.put("/users/profile/:id", authenticate, updateUserProfile);
userRouter.delete("/users/profile/:id", authenticate, deleteUserAccount);

//user wishlist
userRouter.post("/users/wishlist", authenticate, addToWishlist);
userRouter.get("/users/wishlist", authenticate, getWishlist);
userRouter.delete(
  "/users/wishlist/:productId",
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
