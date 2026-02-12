import { cookies } from "next/headers";

export enum TimeSlot {
  MORNING, // e.g., 8:00 AM - 12:00 PM
  AFTERNOON, // e.g., 12:00 PM - 5:00 PM
  EVENING, // e.g., 5:00 PM - 9:00 PM
  NIGHT, // e.g., 9:00 PM - 12:00 AM
}

export type TutorUpdateInput = {
    timeSlots: string[];
    categoryId: any;
    userId: string | null;
    title: string;
    bio: string;
    rate: number;
    poster: string;
};

export const tutorServices = {
  getAllTutors: async function () {
    try {
      const res = await fetch(`${process.env.API_URL}/api/v1/tutor`, {
        cache: "no-store",
      });

      const data = await res.json();

      return { data: data.data, error: null };
    } catch (err: any) {
      // console.error("[createTutor]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },

 createTutor: async (tutorData: TutorUpdateInput) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(tutorData),
        credentials: "include", // ← usually needed for cookies/sessions
        cache: "no-store",
      });

      console.log(tutorData)

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
            message: data?.error?.message || data?.message || "Failed to create tutor",
            status: res.status,
          },
        };
      }

      return {
        data: data?.data || data,
        error: null,
      };
    } catch (err: any) {
      // console.error("[createTutor]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },


  getSingleTutor: async function (id: string) {
      try {
        const res = await fetch(`${process.env.API_URL}/api/v1/tutor/${id}`, {
          cache: "no-store",
        });
  
        const data = await res.json();
  
        return { data: data.data, error: null };
        
      } catch (err) {
      // console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  }

};
