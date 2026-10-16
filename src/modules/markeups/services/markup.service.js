import api from "@/services/api";

export const createMarkupApi = async (data) => {
  const res = await api.post("/markup/createMarkup", data, {
    // skipToast: true,
  });

  return res?.data;
};

// ================= GET ALL =================

export const getMarkupsApi = async (params = {}) => {
  const res = await api.get("/markup/getAllMarkups", {
    params,
    skipToast: true,
  });

  return {
    markups: res?.data?.data || [],

    meta: res?.data?.meta || {},
  };
};
// ================= UPDATE =================

export const updateMarkupApi = async ({ id, data }) => {
  const res = await api.put(`/markup/${id}`, data, {
    // skipToast: true,
  });

  return res?.data;
};

// ================= DELETE =================

export const deleteMarkupApi = async (id) => {
  const res = await api.delete(`/markup/${id}`, {
    // skipToast: true,
  });

  return res?.data;
};

// ================= UPDATE STATUS =================

export const updateMarkupStatusApi = async ({ id, data }) => {
  const res = await api.patch(`/markup/status/${id}`, data, {
    // skipToast: true,
  });

  return res?.data;
};

// ================= COUNTRIES =================

export const getCountriesApi = async (search = "") => {
  const res = await api.get(`/countries?search=${search}`, {
    skipToast: true,
  });

  return res?.data?.data || [];
};

// ================= STATES =================

export const getStatesApi = async ({ countryCode, search = "" }) => {
  const res = await api.get(`/states/${countryCode}?search=${search}`, {
    skipToast: true,
  });

  return res?.data?.data || [];
};

// ================= CITY / HOTEL =================

export const getCitiesHotelsApi = async (searchText = "") => {
  const searchInput = searchText?.trim();

  if (!searchInput) {
    return [];
  }

  const response = await api.post(
    "/destination/search",
    {
      searchInput,
    },
    {
      skipToast: true,
    },
  );

  return response?.data?.data || [];
};

export const startCMSHotelSearchApi = async ({
  locationId,
  geoCode,
  checkIn,
  checkOut,
  rooms,
  destinationCountryCode,
}) => {
  const response = await api.post(
    "/hotelSearch/search",
    {
      locationId,
      geoCode,
      checkIn,
      checkOut,
      rooms,
      destinationCountryCode,
    },
    {
      skipToast: true,
    },
  );

  const body = response?.data;
  const searchId = body?.message?.searchId || body?.data?.searchId;
  if (body?.success !== true || !searchId) {
    throw new Error(body?.message || "Hotel search could not be started.");
  }

  return {
    searchId,
    searchSessionId: body?.message?.searchSessionId,
    supplier: body?.message?.supplier,
    status: body?.message?.status || "processing",
  };
};

export const getCMSHotelSearchResultsApi = async ({
  searchId,
  page = 1,
  limit = 5000,
  hotelName = "",
}) => {
  const response = await api.get(
    `/hotelSearch/search/${encodeURIComponent(searchId)}`,
    {
      params: {
        page,
        limit,
        ...(hotelName.trim() && { hotelName: hotelName.trim() }),
      },
      skipToast: true,
    },
  );

  const body = response?.data;
  if (body?.success !== true || !body?.data || typeof body.data !== "object") {
    throw new Error(body?.message || "Hotel search results could not be loaded.");
  }

  return body.data;
};
// ================= CREATE TAX =================

export const createTaxApi = async (data) => {
  const res = await api.post("/tax/create", data);

  return res?.data;
};

// ================= TAX LIST =================

export const getTaxesApi = async (params = {}) => {
  const res = await api.get("/tax/all", {
    params,
    skipToast: true,
  });

  return {
    taxes: res?.data?.data || [],
    meta: res?.data?.meta || {},
  };
};

// ================= UPDATE TAX =================

export const updateTaxApi = async ({ id, data }) => {
  const res = await api.put(`/tax/update/${id}`, data);

  return res?.data;
};

// ================= DELETE TAX =================

export const deleteTaxApi = async (id) => {
  const res = await api.delete(`/tax/delete/${id}`);

  return res?.data;
};

// ================= UPDATE TAX STATUS =================

export const updateTaxStatusApi = async ({ id, data }) => {
  const res = await api.patch(`/tax/status/${id}`, data);

  return res?.data;
};
