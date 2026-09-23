import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCouponApi,
  deleteCouponApi,
  getCouponsApi,
  updateCouponApi,
  updateCouponStatusApi,
} from "../services/coupon.service";

export const useCouponCodes = (params = {}) => {
  const queryClient = useQueryClient();

  // ================= GET =================

  const { data, isLoading } = useQuery({
    queryKey: ["couponCodes", params],
    queryFn: () => getCouponsApi(params),
    keepPreviousData: true,
  });

  console.log("React Query Data =>", data);

  // ================= CREATE =================

  const createCoupon = useMutation({
    mutationFn: createCouponApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["couponCodes"],
      });
    },
  });

  // ================= UPDATE =================

  const updateCoupon = useMutation({
    mutationFn: ({ id, data }) =>
      updateCouponApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["couponCodes"],
      });
    },
  });

  // ================= STATUS UPDATE =================

  const updateStatus = useMutation({
    mutationFn: ({ id, data }) =>
      updateCouponStatusApi({
        id,
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["couponCodes"],
      });
    },
  });

  // ================= DELETE =================

  const deleteCoupon = useMutation({
    mutationFn: deleteCouponApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["couponCodes"],
      });
    },
  });

  return {
    coupons: data?.coupons || [],
    meta: data?.meta || {},
    isLoading,

    createCoupon,
    updateCoupon,
    updateStatus,
    deleteCoupon,
  };
};
