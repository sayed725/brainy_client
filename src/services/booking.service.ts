import { cookies } from "next/headers";
import { headers } from "next/headers";

export const bookingServices = {
  createBooking: async (bookingData: any) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(bookingData),
        credentials: "include", // ← usually needed for cookies/sessions
        cache: "no-store",
      });

      console.log(bookingData);

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        return {
          data: null,
          error: {
            message: data?.error?.message || data?.message || "Failed to book",
            status: res.status,
          },
        };
      }
    } catch (err: any) {
      // console.error("[createTutor]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },

  getBookingsByUserId: async (id: string) => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/v1/booking/byUserId/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include cookies if your backend relies on them for auth
            Cookie: cookieStore.toString(),
          },
          credentials: "include", // Ensure cookies are sent
          cache: "no-store", // Always fetch fresh data
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        return {
          error: { message: errorData?.message || "Failed to get bookings" },
        };
      }

      const data = await res.json();

      return { data: data, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  // getMyBookings: async () => {
  //   const headersList = await headers();
  //   try {
  //     const res = await fetch(
  //       `${process.env.BACKEND_URL}/api/v1/booking/getMyBookings`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           // Include cookies if your backend relies on them for auth
  //           Cookie: headersList.get("cookie") || "",
  //         },
  //         credentials: "include", // Ensure cookies are sent
  //         cache: "no-store", // Always fetch fresh data
  //       },
  //     );

  //     const data = await res.json();

  //     return { data: data, error: null };
  //   } catch (err) {
  //     console.error(err);
  //     return { data: null, error: { message: "Something Went Wrong" } };
  //   }
  // },

  getBookingsByTutorId: async (id: string) => {
     const cookieStore = await cookies();
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/v1/booking/byTutorId/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include cookies if your backend relies on them for auth
            Cookie: cookieStore.toString(),
          },
          credentials: "include", // Ensure cookies are sent
          cache: "no-store", // Always fetch fresh data
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        return {
          error: { message: errorData?.message || "Failed to get bookings" },
        };
      }

      const data = await res.json();

      return { data: data, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/v1/booking/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
          },
          credentials: "include", // Ensure cookies are sent
          cache: "no-store", // Always fetch fresh data
          body: JSON.stringify({ status: status }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        return {
          error: { message: errorData?.message || "Failed to update status" },
        };
      }

    const data = await res.json();

      return { data: data, error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Network or server error" } };
    }
  },

  deleteBooking: async (bookingId: string) => {
    const cookieStore = await cookies();
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/v1/booking/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
          },
          credentials: "include", // Ensure cookies are sent
          cache: "no-store", // Always fetch fresh data
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        return { error: { message: errorData?.message || "Failed to delete" } };
      }
      const data = await res.json();

      return { data: data, error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Network or server error" } };
    }
  },
};
