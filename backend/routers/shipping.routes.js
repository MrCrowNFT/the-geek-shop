import express from "express";

const shippingRouter = express.Router();

shippingRouter.get("/");
shippingRouter.post("/new");
shippingRouter.put("/:id");
shippingRouter.delete("/:id");

export default shippingRouter;
