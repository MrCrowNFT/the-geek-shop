// src/api/interceptors/response.ts
import { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { refreshAccessToken } from "../services/auth";
import axios from "axios";
import { ApiRequestConfig } from "@/types/api";

//Handle 401 errors and refresh the token when they occur
export const setupResponseInterceptor = (api: AxiosInstance): void => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ApiRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          console.error("Authentication failed:", refreshError);

          //todo redirect to login
        }
      }

      return Promise.reject(error);
    }
  );
};
