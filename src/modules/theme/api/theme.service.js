import api from "@/services/api";

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

export const getThemeApi = async () => {
  const res = await api.get("/theme", {
    skipToast: true,
  });

  console.log("THEME API RESPONSE", res.data);

  return res?.data?.data || {};
};

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export const updateThemeApi = async (payload) => {
  const res = await api.put("/theme/update", payload);

  return res?.data;
};
