import api from "../axios";

export const newTracking = async (newTrackingInfo: {
  orderId: string;
  carrier: string;
  trackingNumber: string;
}) => {
  try {
    const res = await api.post("/tracking/", newTrackingInfo);
    return res.data;
  } catch (err) {
    console.error("Creating tracking info error:", err);
    throw err;
  }
};

export const getTrackingInfo = async (trackingId: string) => {
  try {
    const res = await api.get(`/tracking/${trackingId}`);
    return res.data;
  } catch (err) {
    console.error("Fetching tracking info error:", err);
    throw err;
  }
};

export const updateTrackingInfo = async (
  trackingId: string,
  updatedTrackingInfo: {
    orderId: string;
    carrier: string;
    trackingNumber: string;
  }
) => {
  try {
    const res = await api.put(`/tracking/${trackingId}`, updatedTrackingInfo);
    return res.data;
  } catch (err) {
    console.error("Updting tracking info error:", err);
    throw err;
  }
};
