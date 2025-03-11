import express from "express";

const orderRouter = express.Router();

//user 
orderRouter.get("/");
orderRouter.post("/new");
orderRouter.put("/:id");
orderRouter.delete("/:id");

//admin
orderRouter.get("/admin/");
orderRouter.put("/:id");
orderRouter.delete("/:id");


export default orderRouter;
