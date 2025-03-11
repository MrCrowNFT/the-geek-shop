import express from "express";
import { login, logout, refreshToken } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", login);

//refresh access token
authRouter.post("/refresh-token", refreshToken);

authRouter.post("/logout", logout);

export default authRouter;
