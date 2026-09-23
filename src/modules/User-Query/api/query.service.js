import api from "@/services/api";

export const getContactQuery = async (params = {}) => {
  const res = await api.get("/admin/all-contacts", {
    params,
  });

  return res.data;
};

export const updateContactStatus = async (id, payload) => {
  const res = await api.patch(`/admin/update-contact/${id}`, payload);

  return res.data;
};
