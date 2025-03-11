import express from "express";

const userRouter = express.Router();

//user routes
userRouter.get("/users/profile");
userRouter.put("/users/profile");
userRouter.delete("/users/profile");

//user wishlist
userRouter.post("/users/wishlist");
userRouter.get("/users/wishlist");
userRouter.delete("/users/wishlist/:productId");

//admin routes
userRouter.post("/new-admin");
userRouter.post("/login-admin");
userRouter.put("/admin/:id");
userRouter.delete("/admin/:id");

export default userRouter;
