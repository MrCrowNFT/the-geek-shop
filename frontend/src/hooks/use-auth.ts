import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupRequest } from "@/api/services/auth";

// Signup hook
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { username: string; password: string; email: string }) =>
      signupRequest(data.username, data.password, data.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Signup mutation error:", error);
      throw error;
    },
  });
};
