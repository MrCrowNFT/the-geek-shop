import express from "express";
import {
  getProductById,
  getProducts,
  productSearch,
} from "../controllers/product.user.controller";
import { authenticate, verifyAdmin } from "../middleware/auth";
import {
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.admin.controller";

const productRouter = express.Router();

//user
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/search", productSearch);

//admin
productRouter.get("/admin/", authenticate, verifyAdmin, getAdminProducts);
productRouter.get("/admin/:id", authenticate, verifyAdmin, getAdminProductById);
productRouter.post("/admin/new", authenticate, verifyAdmin, newProduct);
productRouter.put("/admin/:id", authenticate, verifyAdmin, updateProduct);
productRouter.delete("/admin/:id", authenticate, verifyAdmin, deleteProduct);

export default productRouter;
