import api from "@/services/api";

// ================= CREATE =================

export const createCouponApi = async (data) => {
  const res = await api.post("/couponCode/create-coupon", data, {
    // skipToast: true,
  });

  return res?.data;
};

// ================= GET ALL =================

export const getCouponsApi = async (params = {}) => {
  const res = await api.get("/couponCode/get-all-coupons", {
    params,
    skipToast: true,
  });

  console.log("API Response =>", res.data);

  return {
    coupons: res.data.data.coupons,
    meta: res.data.data.pagination,
  };
};

// ================= GET SINGLE =================

export const getSingleCouponApi = async (id) => {
  const res = await api.get(`/couponCode/get-single-coupon/${id}`, {
    skipToast: true,
  });

  return res?.data?.data;
};

// ================= UPDATE =================

export const updateCouponApi = async ({ id, data }) => {
  const res = await api.put(`/couponCode/update-coupon/${id}`, data);

  return res?.data;
};

// ================= STATUS UPDATE =================

export const updateCouponStatusApi = async ({ id, data }) => {
  const res = await api.patch(`/couponCode/coupon-status/${id}`, data, {
    // skipToast: true,
  });

  return res?.data;
};

// ================= DELETE =================

export const deleteCouponApi = async (id) => {
  const res = await api.delete(`/couponCode/delete-coupon/${id}`);

  return res?.data;
};
