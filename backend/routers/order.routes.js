import express from "express";

const orderRouter = express.Router();

orderRouter.get("/");
orderRouter.post("/new");
orderRouter.put("/:id");
orderRouter.delete("/:id");

export default orderRouter;
