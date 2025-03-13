import express from "express";
import { authenticate } from "../middleware/auth";
import {
  createShipping,
  deleteShipping,
  getShippingById,
  getUserShippingAddresses,
  updateShipping,
} from "../controllers/shipping.controller";

const shippingRouter = express.Router();

shippingRouter.get("/", authenticate, getUserShippingAddresses);
shippingRouter.get("/:id", authenticate, getShippingById);
shippingRouter.post("/new", authenticate, createShipping);
shippingRouter.put("/:id", authenticate, updateShipping);
shippingRouter.delete("/:id", authenticate, deleteShipping);

export default shippingRouter;
