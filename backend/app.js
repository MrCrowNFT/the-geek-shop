import express from "express";
import cors from "cors";
import authRouter from "./routers/auth.routes";
import categoryRouter from "./routers/category.routes";
import orderRouter from "./routers/order.routes";
import shippingRouter from "./routers/shipping.routes";
import userRouter from "./routers/user.routes";
import stripeRouter from "./routers/stripe.routes";

const app = express();

app.use(express.json()); //accept JSON files
app.use(cors()); // Allow all origins: probably should change it just specific one

app.use("/auth", authRouter);
app.use("/category/", categoryRouter);
app.use("/order/", orderRouter);
app.use("/shipping/", shippingRouter);
app.use("/user/", userRouter);
app.use("/stripe", stripeRouter);

export default app;
