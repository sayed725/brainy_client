"use server";

import { bookingServices } from "@/services/booking.service";
import { updateTag } from "next/cache";

export const addBooking = async (bookingData: any) => {
  const result = await bookingServices.createBooking(bookingData);
   updateTag("createBooking")
  return result; // { data, error }
};