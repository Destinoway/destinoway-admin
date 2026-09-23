import api from "@/services/api";

// 🔹 Get All Roles
export const getRoles = async () => {
  const res = await api.get("/roles");
  return res.data;
};

// 🔹 Get All Roles
export const getRolesDropdown = async () => {
  const res = await api.get("/roles/dropdown", {
    skipToast: true,
  });
  return res.data;
};

// 🔹 Get Single Role
export const getRoleById = async (id) => {
  const res = await api.get(`/roles/${id}`);
  return res.data;
};

// 🔹 Create Role
export const createRole = async (data) => {
  const res = await api.post("/roles", data);
  return res.data;
};
// 🔹 Delete Role
export const deleteRole = async (id) => {
  console.log("DELETE ROLE API ID:", id);

  const res = await api.delete(`/roles/${id}`);

  console.log("DELETE ROLE RESPONSE:", res.data);

  return res.data;
};

// 🔹 Update Role
export const updateRole = async (id, data) => {
  const res = await api.put(`/roles/${id}`, data);
  return res.data;
};

export const statusUpdateRole = async (id, data) => {
  const res = await api.patch(`/roles/${id}/status`, data);
  return res.data;
};
