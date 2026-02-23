"use server";

import { bookingServices } from "@/services/booking.service";
import { updateTag } from "next/cache";

export const addBooking = async (bookingData: any) => {
  const result = await bookingServices.createBooking(bookingData);
   updateTag("createBooking")
  return result; // { data, error }
};

export const getBookings = async (id: string) => {
  
  const result =  await bookingServices.getBookingsByUserId(id);
  updateTag("getBookings")
  return result; // { data, error }

};



export async function updateBookingStatus(bookingId: string, status: string) {
  
   const result=  await bookingServices.updateBookingStatus(bookingId, status)
   updateTag("getBookings")
   return result;
 
}

export async function deleteBooking(bookingId: string) {
  // try {
  //   await bookingServices.deleteBooking(bookingId);
  //   revalidatePath("/dashboard/bookings");
  //   return { error: null };
  // } catch (error: any) {
  //   return { error: { message: error.message } };
  // }
}