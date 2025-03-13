import express from "express";
import {
  getProductById,
  getProducts,
  productSearch,
} from "../controllers/product.user.controller";
import { authenticate, verifyAdmin } from "../middleware/auth";
import {
  deleteProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.admin.controller";

const productRouter = express.Router();

//user
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/search", productSearch);

//admin
productRouter.post("/new", authenticate, verifyAdmin, newProduct);
productRouter.put("/:id", authenticate, verifyAdmin, updateProduct);
productRouter.delete("/:id", authenticate, verifyAdmin, deleteProduct);

export default productRouter;
