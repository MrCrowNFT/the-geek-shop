import api from "../axios";
import { refreshAccessTokenRequest } from "../utils/tokenRefresh";

//TODO: All the api calls on the services using a try catch block, this was written before
//TODO: integrating react query which adds a layer of error hanlig, and also,i added extra error
//TODO: handling at the component level, therefor these try catch block are redundant,
//TODO: so, probably just eliminate them, the component can also just access the loginMutation.error


//signup call
export const signupRequest = async (
  username: string,
  password: string,
  email: string
) => {
  try {
    const res = await api.post("/auth/signup", { username, password, email });
    return res.data;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

//login request
export const loginRequest = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });

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
