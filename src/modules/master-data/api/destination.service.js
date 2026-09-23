import api from "@/services/api";

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export const getDestinationsApi = async (params = {}) => {
  const res = await api.get("/masterData/admin", {
    params,
    skipToast: true,
  });

  return res?.data?.data || [];
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createDestinationApi = async (payload) => {
  const res = await api.post("/masterData/createDestination", payload);

  return res?.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateDestinationApi = async ({ id, data }) => {
  const res = await api.put(`/destinations/${id}`, data);

  return res?.data;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteDestinationApi = async (id) => {
  const res = await api.delete(`/destinations/${id}`);

  return res?.data;
};
