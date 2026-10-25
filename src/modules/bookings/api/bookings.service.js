import api from "@/services/api";

export const getHotelBookings = async (params = {}) => {
  const res = await api.get("/admin/hotel-bookings", { params });
  return res.data;
};

export const getHotelBookingByReference = async (bookingRef) => {
  const res = await api.get(
    `/admin/hotel-bookings/${encodeURIComponent(bookingRef)}`,
  );
  return res.data;
};
