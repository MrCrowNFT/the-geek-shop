import express from "express";
import {
  createTracking,
  getTrackingById,
  updateTracking,
} from "../controllers/tracking.controller.js";
import { authenticate, verifyAdmin } from "../middleware/auth.js";

const trackingRouter = express.Router();

trackingRouter.post("/", authenticate, verifyAdmin, createTracking);
trackingRouter.get("/:id", authenticate, verifyAdmin, getTrackingById);
trackingRouter.put("/:id", authenticate, verifyAdmin, updateTracking);

export default trackingRouter;
