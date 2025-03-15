import express from "express";
import { createPaymentIntent } from "../controllers/stripe.controllet";
import { authenticate } from "../middleware/auth";

const stripeRouter = express.Router();

stripeRouter.post("/create-payment-intent", authenticate, createPaymentIntent);

export default stripeRouter;
