import { getTrackingInfo, newTracking } from "@/api/services/tracking";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useFetchTrackingInfo = (trackingId: string) => {
  return useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: async () => {
      return getTrackingInfo(trackingId);
    },
    staleTime: 1000 * 60 * 5, // Keep cache fresh for 5 mins
  });
};

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


