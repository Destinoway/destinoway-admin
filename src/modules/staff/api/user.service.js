import api from "@/services/api";

export const getUsers = async (params = {}) => {
  const res = await api.get("/users", {
    params,
  });

  return res.data;
};

export const createStaff = async (data) => {
  const res = await api.post("/users/staff", data);
  return res.data;
};

export const updateStaff = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const updateStaffStatus = async (id, data) => {
  const res = await api.patch(`/users/${id}/status`, data);

  return res.data;
};
