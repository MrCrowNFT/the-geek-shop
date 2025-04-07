import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.routes";
import categoryRouter from "./routers/category.routes";
import orderRouter from "./routers/order.routes";
import shippingRouter from "./routers/shipping.routes";
import userRouter from "./routers/user.routes";
import stripeRouter from "./routers/stripe.routes";
import trackingRouter from "./routers/tracking.routes";

const app = express();

app.use(express.json()); //accept JSON files
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", //only accept from here where frontend is running
    credentials: true, //need this for the cookies to work cross origin 
  })
);

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/order", orderRouter);
app.use("/shipping", shippingRouter);
app.use("/user", userRouter);
app.use("/stripe", stripeRouter);
app.use("/tracking", trackingRouter);

export default app;
