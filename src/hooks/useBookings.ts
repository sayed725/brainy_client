import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { Booking } from "@/constants/otherinterface";

// Helper to reliably extract array data from various possible response structures
const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export function useAllBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const result = await fetchApi("/api/v1/booking");
      return extractData(result) as Booking[];
    },
  });
}

export function useUserBookings(userId?: string) {
  return useQuery({
    queryKey: ["bookings", "user", userId],
    queryFn: async () => {
      if (!userId) return [];
      const result = await fetchApi(`/api/v1/booking/byUserId/${userId}`);
      return extractData(result) as Booking[];
    },
    enabled: !!userId,
  });
}

export function useTutorBookings(tutorId?: string) {
  return useQuery({
    queryKey: ["bookings", "tutor", tutorId],
    queryFn: async () => {
      if (!tutorId) return [];
      const result = await fetchApi(`/api/v1/booking/byTutorId/${tutorId}`);
      return extractData(result) as Booking[];
    },
    enabled: !!tutorId,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      return fetchApi(`/api/v1/booking/${bookingId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingId: string) => {
      return fetchApi(`/api/v1/booking/${bookingId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: any) => {
      return fetchApi(`/api/v1/booking`, {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
