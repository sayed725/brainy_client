import { get } from "http";
import { cookies } from "next/headers";

export interface ReviewInput {
  rating: number;
  comment?: string | null;
  tutorId: string;
  bookingId: string;
  userId: string;
}

export const reviewServices = {
  createReview: async (data: ReviewInput) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
        credentials: "include",
        cache: "no-store",
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = null;
      }
      if (!res.ok) {
        return {
          data: null,
          error: {
            message:
              responseData?.error?.message ||
              responseData?.message ||
              "Failed to create review",
            status: res.status,
          },
        };
      }

      return {
        data: responseData?.data || responseData,
        error: null,
      };
    } catch (err: any) {
      console.error("[createReview]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },

  getAllReviews: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(
        `${process.env.BACKEND_URL}/api/v1/review`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
          },
          credentials: "include",
          cache: "no-store",
        },
      );
      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = null;
      }
      if (!res.ok) {
        return {
          data: null,
          error: {
            message:
              responseData?.error?.message ||
              responseData?.message ||
              "Failed to fetch reviews",
            status: res.status,
          },
        };
      }
      return {
        data: responseData?.data || responseData,
        error: null,
      };
    } catch (err: any) {
      console.error("[getAllReviews]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },
};
