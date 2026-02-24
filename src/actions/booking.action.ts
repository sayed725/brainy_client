"use server";

import { bookingServices } from "@/services/booking.service";
import { updateTag } from "next/cache";

export const addBooking = async (bookingData: any) => {
  const result = await bookingServices.createBooking(bookingData);
   updateTag("createBooking")
  return result; // { data, error }
};

export const getBookingsByUserId = async (id: string) => {
  
  const result =  await bookingServices.getBookingsByUserId(id);
  updateTag("getBookings")
  return result; // { data, error }

};
export const getBookingsByTutorId = async (id: string) => {
  
  const result =  await bookingServices.getBookingsByTutorId(id);
  updateTag("getBookings")
  return result; // { data, error }

};



export async function updateBookingStatus(bookingId: string, status: string) {
  
   const result=  await bookingServices.updateBookingStatus(bookingId, status)
     if (result?.error) {
    throw new Error(result.error.message || "Failed to delete booking");
  }
   updateTag("getBookings")
   return result;
 
}

export async function deleteBooking(bookingId: string) {
    const result=  await bookingServices.deleteBooking(bookingId)
    if (result?.error) {
    throw new Error(result.error.message || "Failed to delete booking");
  }
    updateTag("getBookings")
    return result;
}

