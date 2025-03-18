import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

//refresh access token don't need authenticate (how could ir refresh the invalid token
//if i need a valid token to do so, does not make sense)
authRouter.post("/refresh-token", refreshAccessToken);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
