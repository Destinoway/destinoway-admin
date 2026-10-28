import BookingDetailsPage from "@/modules/bookings/pages/BookingDetailsPage";

export default async function Page({ params }) {
  const { bookingRef } = await params;
  return <BookingDetailsPage bookingRef={bookingRef} />;
}
