import {
  getTrackingInfo,
  newTracking,
  updateTrackingInfo,
} from "@/api/services/tracking";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

//todo -> the user function will be deleted, it will be gotten with the order 
//todo update the backend to populate the traking info response 
export const useFetchTrackingInfo = (trackingId: string) => {
  return useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: async () => {
      return getTrackingInfo(trackingId);
    },
    staleTime: 1000 * 60 * 5, // Keep cache fresh for 5 mins
  });
};

//
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

export const useUpdateTracking = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      trackingId,
      updatedTrackingInfo,
    }: {
      trackingId: string;
      updatedTrackingInfo: {
        orderId: string;
        carrier: string;
        trackingNumber: string;
      };
    }) => updateTrackingInfo(trackingId, updatedTrackingInfo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tracking"]);
      },
      onError: (error) => {
        console.error("Updating tracking info mutation error:", error);
        throw error;
      },
    }
  );
};
