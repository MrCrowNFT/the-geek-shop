import express from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

//refresh access token
authRouter.post("/refresh-token", authenticate, refreshToken);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
