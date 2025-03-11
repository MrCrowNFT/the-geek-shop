import express from "express";

const productRouter = express.Router();

productRouter.get("/");
productRouter.post("/new");
productRouter.put("/:id");
productRouter.delete("/:id");

export default productRouter;
