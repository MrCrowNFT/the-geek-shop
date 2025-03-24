import { newTracking } from "@/api/services/tracking";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useNewTracking = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newTrackingInfo: {
      orderId: string;
      carrier: string;
      trackingNumber: string;
    }) => newTracking(newTrackingInfo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tracking"]);
      },
      onError: (error) => {
        console.error("Create tracking mutation error:", error);
        throw error;
      },
    }
  );
};
