import { cookies } from "next/headers";

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
            message:
              data?.error?.message || data?.message || "Failed to book",
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
};
