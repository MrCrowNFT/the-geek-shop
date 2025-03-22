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

// Signup hook
export const useSignup = (): UseMutationResult<any, Error, SignupParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SignupParams) => signupRequest(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      // Global error handling
      console.error("Signup mutation error:", error);
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
    },
  });
};
