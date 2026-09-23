import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export const getHomeContentApi = async () => {
  const res = await api.get("/homecontent/admin", {
    skipToast: true,
  });

  console.log("HOME CONTENT RESPONSE", res.data);

  return res?.data?.data || [];
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createHomeContentApi = async (payload) => {
  const res = await api.post("/homecontent", payload);

  return res?.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateHomeContentApi = async ({ id, data }) => {
  const res = await api.put(`/homecontent/update/${id}`, data);

  return res?.data;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteHomeContentApi = async (id) => {
  const res = await api.delete(`/homecontent/${id}`);

  return res?.data;
};
