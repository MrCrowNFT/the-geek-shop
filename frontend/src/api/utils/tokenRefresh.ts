import axios from "axios";

//i put this here instead of api/auth since this wont use the api axios instance,
//it would be circular, calling it self, weirdly, better put it here
export const refreshAccessTokenRequest = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.post(
      "http://localhost:5500/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    if (res.data && res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data.accessToken;
    }

    return null;
  } catch (err) {
    console.error("Token refresh error:", err);
    throw err;
  }
};
