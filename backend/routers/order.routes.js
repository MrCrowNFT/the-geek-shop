import express from "express";
import { authenticate, verifyAdmin } from "../middleware/auth.js";
import { addOrderToShipping, cancelOrder, createOrder, getUserOrders } from "../controllers/order.user.controller.js";
import { getOrderById, getOrders, orderSearch, updateOrder } from "../controllers/order.admin.controller.js";

const orderRouter = express.Router();

//user 
orderRouter.get("/", authenticate, getUserOrders);
orderRouter.post("/new", authenticate, createOrder, addOrderToShipping);
orderRouter.put("/:id/cancel", authenticate, cancelOrder);

//admin
orderRouter.get("/admin/", authenticate, verifyAdmin, getOrders);
orderRouter.get("/admin/:id", authenticate, verifyAdmin, getOrderById);
orderRouter.get("/admin/search", authenticate, verifyAdmin, orderSearch);
orderRouter.put("/:id", authenticate, verifyAdmin, updateOrder);


export default orderRouter;
