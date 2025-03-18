import { loginRequest, signupRequest } from "@/api/services/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupRequest,
    onSuccess: () => {
      return <></>; //return a success component
    },
    onError: (error) => {
      console.error("Signup error:", error);
      throw error;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      //todo Change from local storage -> state management
      // Store the access token in localStorage, the refresh token is set on httpOnly cookie on server
      //so don't need to handle it
      localStorage.setItem("accessToken", data.accessToken);
    },
    onError: (error) => {
      console.error("Login error:", error);
      throw error;
    },
  });
};
