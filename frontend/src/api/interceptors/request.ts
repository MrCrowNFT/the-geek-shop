import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/api";
import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "../services/auth";

//Refresh the access token before it expires for a seamless user experience
export const setupRequestInterceptor = (api: AxiosInstance): void => {
  api.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          // Check if token is expired or about to expire
          const decoded = jwtDecode<DecodedToken>(accessToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp - currentTime < 30) {
            // 30 seconds before expiration
            const newToken = await refreshAccessToken();
            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
              return config;
            }
          }

          config.headers.Authorization = `Bearer ${accessToken}`;
        } catch (error) {
          console.error("Token validation error:", error);
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};
