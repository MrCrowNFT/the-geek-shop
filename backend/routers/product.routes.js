import express from "express";
import {
  getProductById,
  getProducts,
  productSearch,
} from "../controllers/product.user.controller.js";
import { authenticate, verifyAdmin } from "../middleware/auth.js";
import {
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.admin.controller.js";
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()})
const productRouter = express.Router();

//user
productRouter.get("/", getProducts);
productRouter.get("/search", productSearch); 

//admin
productRouter.get("/admin/", authenticate, verifyAdmin, getAdminProducts);
productRouter.get("/admin/:id", authenticate, verifyAdmin, getAdminProductById);
productRouter.post("/admin/new", authenticate, verifyAdmin, upload.array("images", Number(process.env.MAX_IMG_AMOUNT)), newProduct);
productRouter.put("/admin/:id", authenticate, verifyAdmin, updateProduct);
productRouter.delete("/admin/:id", authenticate, verifyAdmin, deleteProduct);

// This needs to come LAST since it's a catch-all for IDs
productRouter.get("/:id", getProductById);

export default productRouter;
