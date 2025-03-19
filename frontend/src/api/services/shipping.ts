import api from "../axios";

export const getShippingAddresses = async () => {
  try {
    const res = await api.get("/shipping/");
    return res.data;
  } catch (err) {
    console.error("Fetching shipping addresses error:", err);
    throw err;
  }
};

export const getShippingAddressById = async (id: string) => {
  try {
    const res = await api.get(`/shipping/${id}`);
    return res.data;
  } catch (err) {
    console.error("Fetching shipping address error:", err);
    throw err;
  }
};

export const createShippingAddress = async (
  id: string,
  newShippingAddress: {
    name: string;
    phone: string;
    run: string;
    address: string;
    region: string;
    indications?: string;
  }
) => {
  try {
    const res = await api.post(`/shipping/${id}`, newShippingAddress);
    return res.data;
  } catch (err) {
    console.error("Creating shipping address error:", err);
    throw err;
  }
};

export const updateShippingAddress = async (
  id: string,
  shippingId: string,
  updatedShippingAddress: {
    name?: string;
    phone?: string;
    run?: string;
    address?: string;
    region?: string;
    indications?: string;
  }
) => {
  try {
    const res = await api.put(`/shipping/${id}`, updatedShippingAddress, {
      params: { shippingId },
    });

    return res.data;
  } catch (err) {
    console.error("Updating shipping address error:", err);
    throw err;
  }
};

export const deleteShippingAddress = async (shippingId: string) => {
  try {
    const res = await api.delete(`/shipping/${shippingId}`);
    return res.data;
  } catch (err) {
    console.error("Deleting shipping address error:", err);
    throw err;
  }
};
