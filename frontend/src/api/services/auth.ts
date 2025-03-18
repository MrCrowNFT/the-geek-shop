import axios from "axios";
import { SignupParams, LoginParams } from "@/types/api";

//signup call

export const signupRequest = async ({
  username,
  password,
  email,
}: SignupParams) => {
  try {
    const res = await axios.post(
      "http://localhost:5500/auth/signup",
      { username, password, email },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // Return only the data
  } catch (err) {
    console.error("Signup error:", err);
    throw err; // Re-throw to be handled by the caller
  }
};

//login call
export const loginRequest = async ({ username, password }: LoginParams) => {
  try {
    const res = await axios.post(
      "http://localhost:5500/auth/login",
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // Return only the data
  } catch (err) {
    console.error("Login error:", err);
    throw err; // Re-throw to be handled by the caller
  }
};

//refresh token call
export const refreshAccessToken = async () => {
  try {
    // Get the access token from local storage
    const accessToken = localStorage.getItem("accessToken");

    // Make the API call with the access token in the Authorization header
    const res = await axios.post(
      "http://localhost:5500/auth/refresh-token",
      {}, // Empty body since we're sending tokens via header and cookies
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true, //  ensures cookies are sent with the request
      }
    );
    return res.data; // Return only the data
  } catch (err) {
    console.error("Token refresh error:", err);
    throw err; // Re-throw to be handled by the caller
  }
};

//logout call
export const logoutRequest = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.post(
      "http://localhost:5500/auth/logout",
      {}, //empty body since token on httponly cookie
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
};
