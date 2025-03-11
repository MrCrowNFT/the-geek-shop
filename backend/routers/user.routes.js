import express from "express";

const userRouter = express.Router();

//user routes
userRouter.get("/");
userRouter.post("/new");
userRouter.post("/login");
userRouter.put("/:id");
userRouter.delete("/:id");

//admin routes
userRouter.post("/new-admin");
userRouter.post("/login-admin");
userRouter.put("/admin/:id");
userRouter.delete("/admin/:id");

export default userRouter;
