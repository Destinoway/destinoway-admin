import api from "@/services/api";

export const getCMSPagesApi = async (params = {}) => {
  const res = await api.get("/cms", {
    params,
    skipToast: true,
  });

  return {
    pages: res?.data?.data?.data || [],

    meta: res?.data?.data || {},
  };
};

/*
GET SINGLE
*/
export const getCMSPageApi = async (id) => {
  const res = await api.get(`/cms/${id}`, {
    skipToast: true,
  });

  return res?.data?.data || null;
};

/*
CREATE
*/
export const createCMSPageApi = async (data) => {
  const res = await api.post("/cms", data);

  return res?.data;
};

/*
UPDATE
*/
export const updateCMSPageApi = async ({ id, data }) => {
  const res = await api.put(`/cms/${id}`, data);

  return res?.data;
};

/*
DELETE
*/
export const deleteCMSPageApi = async (id) => {
  const res = await api.delete(`/cms/${id}`);

  return res?.data;
};

/*
TEMPLATES
*/
export const getCMSTemplatesApi = async () => {
  const res = await api.get("/cms/templates", {
    skipToast: true,
  });

  return res?.data?.data || {};
};

/*
ENTITY HELPER
*/
export const getCMSByEntityApi = async ({ entityType, entityId }) => {
  const res = await api.get(`/cms/entity/${entityType}/${entityId}`, {
    skipToast: true,
  });

  return res?.data?.data || null;
};

export const previewSlugApi = async (payload) => {
  const { data } = await api.post("/cms/preview-slug", payload);
  return data.data;
};

/*
MEDIA
*/
export const uploadMediaApi = async (formData) => {
  const res = await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res?.data;
};
