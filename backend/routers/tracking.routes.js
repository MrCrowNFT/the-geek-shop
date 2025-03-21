import express from "express";
import {
  createTracking,
  getTrackingById,
  updateTracking,
} from "../controllers/tracking.controller";
import { authenticate, verifyAdmin } from "../middleware/auth";

const trackingRouter = express.Router();

trackingRouter.post("/", authenticate, verifyAdmin, createTracking);
trackingRouter.get("/:id", authenticate, verifyAdmin, getTrackingById);
trackingRouter.put("/:id", authenticate, verifyAdmin, updateTracking);

export default trackingRouter;
