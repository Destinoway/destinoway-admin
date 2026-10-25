import { useQuery } from "@tanstack/react-query";
import {
  getHotelBookingByReference,
  getHotelBookings,
} from "../api/bookings.service";

export const useBookings = (params, enabled = true) =>
  useQuery({
    queryKey: ["hotel-bookings", params],
    queryFn: () => getHotelBookings(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });

export const useBookingDetails = (bookingRef, enabled = true) =>
  useQuery({
    queryKey: ["hotel-booking", bookingRef],
    queryFn: () => getHotelBookingByReference(bookingRef),
    enabled: enabled && Boolean(bookingRef),
  });
