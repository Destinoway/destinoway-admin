import api from "@/services/api";

export const getContactQuery = async (params = {}) => {
  try {
    const res = await api.get("/admin/all-contacts", {
      params,
      skipToast: true,
    });

    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || "";
    const isEmptyResult =
      error?.response?.status === 404 ||
      /no\b.*\b(data|contacts?|queries|records|results?)\b/i.test(message);

    if (isEmptyResult) {
      return {
        data: {
          contacts: [],
          pagination: { total: 0 },
        },
      };
    }

    throw error;
  }
};

export const updateContactStatus = async (id, payload) => {
  const res = await api.patch(`/admin/update-contact/${id}`, payload);

  return res.data;
};
