import {
  deleteUserAccount,
  getUserProfile,
  updateUserProfile,
} from "@/api/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//User Profile

//this should only be called after logging in
export const useFetchProfile = () => {
  try {
    const data = useQuery({
      queryKey: ["profile"],
      queryFn: getUserProfile,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });
    return data;
  } catch (err) {
    console.error("Caching or refetching profile error:", err);
    throw err;
  }
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedProfile: {
      username?: string;
      email?: string;
      password?: string;
    }) => updateUserProfile(updatedProfile),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Updating profile mutation error:", error);
      throw error;
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(() => deleteUserAccount(), {
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
    onError: (error) => {
      console.error("Deleting user account mutation error:", error);
      throw error;
    },
  });
};
