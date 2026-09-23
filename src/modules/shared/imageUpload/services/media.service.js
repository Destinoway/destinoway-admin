import api from "@/services/api";

export const uploadMediaApi = async (formData) => {
  const res = await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res?.data;
};
