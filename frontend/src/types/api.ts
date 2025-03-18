import { AxiosRequestConfig } from "axios";

export interface SignupParams {
  username: string;
  password: string;
  email: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

//todo check if this is right
export interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

// Add specific config for your API requests
export interface ApiRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
