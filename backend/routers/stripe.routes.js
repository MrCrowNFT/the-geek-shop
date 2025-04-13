import express from "express";
import { createPaymentIntent } from "../controllers/stripe.controller.js";
import { authenticate } from "../middleware/auth.js";

const stripeRouter = express.Router();

stripeRouter.post("/create-payment-intent", authenticate, createPaymentIntent);

export default stripeRouter;
