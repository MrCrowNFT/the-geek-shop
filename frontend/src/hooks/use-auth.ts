import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { SignupParams, LoginParams } from "@/types/api";
import {
  signupRequest,
  loginRequest,
  logoutRequest,
} from "@/api/services/auth"; // Update this path

//todo NO LONGER NEED THIS, USING ZUSTARD FOR PROFILE AND HANDLE ALL AUTH LOGIC FROM THERE
//todo i do need the signup though, but maybe should just use the axios fn directly
// Signup hook
export const useSignup = () => {
  const queryClient = useQueryClient();
//todo fix this
  return useMutation({
    mutationFn: (username: string, password: string, email: string) =>
      signupRequest(username, password, email)}{
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Signup mutation error:", error);
      throw error;
    },
  });
};

// Login hook
export const useLogin = (): UseMutationResult<any, Error, LoginParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LoginParams) => loginRequest(params),
    onSuccess: (data) => {
      // add any additional success handling here

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
      throw error;
    },
  });
};

// Logout hook
export const useLogout = (): UseMutationResult<any, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSuccess: () => {
      // Clear any authenticated data from the query cache
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout mutation error:", error);
      throw error;
    },
  });
};
