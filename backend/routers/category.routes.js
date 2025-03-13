import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller";
import { authenticate, verifyAdmin } from "../middleware/auth";

const categoryRouter = express.Router();

//the get all categories my be used on the page, so no authenticate needed
categoryRouter.get("/", getAllCategories);

categoryRouter.post("/new", authenticate, verifyAdmin, addCategory);
categoryRouter.put("/:id", authenticate, verifyAdmin, updateCategory);
categoryRouter.delete("/:id", authenticate, verifyAdmin, deleteCategory);

export default categoryRouter;
