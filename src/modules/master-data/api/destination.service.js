import api from "@/services/api";

export const getDestinationsApi = async (params = {}) => {
  const res = await api.get("/masterData/admin", {
    params,
    skipToast: true,
  });

  return res?.data?.data || [];
};

export const createDestinationApi = async (payload) => {
  const res = await api.post("/masterData/create", payload);

  return res?.data;
};

export const updateDestinationApi = async ({ id, data }) => {
  const res = await api.put(`/destinations/${id}`, data);

  return res?.data;
};

export const deleteDestinationApi = async (id) => {
  const res = await api.delete(`/destinations/${id}`);

  return res?.data;
};
