import api from "../axios";
import { SignupParams, LoginParams } from "@/types/api";
import { refreshAccessTokenRequest } from "../utils/tokenRefresh";

//signup call
export const signupRequest = async ({
  username,
  password,
  email,
}: SignupParams) => {
  try {
    const res = await api.post("/auth/signup", { username, password, email });
    return res.data;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

//login request
export const loginRequest = async ({ username, password }: LoginParams) => {
  try {
    const res = await api.post("/auth/login", { username, password });

    if (res.data && res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }

    return res.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

// Re-export the standalone function for token refresh for the index
export { refreshAccessTokenRequest as refreshAccessToken };

//logout request
export const logoutRequest = async () => {
  try {
    const res = await api.post("/auth/logout", {});
    localStorage.removeItem("accessToken");
    return res.data;
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
};
