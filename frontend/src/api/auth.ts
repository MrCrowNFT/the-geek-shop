import axios from "axios";

//signup call

interface SignupParams {
  username: string;
  password: string;
  email: string;
}

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

interface LoginParams {
  username: string;
  password: string;
}

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
export const refreshTokenRequest = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5500/auth/refresh-token",
      {}, //empty body since token on httponly cookie
      {
        withCredentials: true, //* This enables sending cookies with the request
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data; // Return only the data
  } catch (err) {
    console.error("Token refresh error:", err);
    throw err; // Re-throw to be handled by the caller
  }
};

//logout call
