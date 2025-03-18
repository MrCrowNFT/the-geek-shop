import { loginRequest, signupRequest } from "@/api/auth";
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
    //the cookie is set serverside, so i don't need to store it?
    //i still need to handle the acces tocken
    onError: (error) => {
      console.error("Login error:", error);
      throw error; 
    },
  });
};
