import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.routes.js";
import categoryRouter from "./routers/category.routes.js";
import orderRouter from "./routers/order.routes.js";
import shippingRouter from "./routers/shipping.routes.js";
import userRouter from "./routers/user.routes.js";
import stripeRouter from "./routers/stripe.routes.js";
import trackingRouter from "./routers/tracking.routes.js";
import productRouter from "./routers/product.routes.js";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 5500;
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

app.listen(PORT, () => {
  connectDb();
  console.log("Server started at http://localhost:" + PORT);
});
