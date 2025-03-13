import express from "express";
import cors from "cors";
import Stripe from "stripe";
import authRouter from "./routers/auth.routes";
import categoryRouter from "./routers/category.routes";
import orderRouter from "./routers/order.routes";
import shippingRouter from "./routers/shipping.routes";
import userRouter from "./routers/user.routes";


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json()); //accept JSON files
app.use(cors()); // Allow all origins: probably should change it just specific one

app.use("/auth", authRouter);
app.use("/category/", categoryRouter);
app.use("/order/", orderRouter);
app.use("/shipping/", shippingRouter);
app.use("/user/", userRouter);

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
