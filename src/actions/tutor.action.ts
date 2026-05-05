"use server";

import { fetchApi } from "@/lib/fetch-api";

export const updateTutor = async (id: string | number, payload: any) => {
  try {
    const result = await fetchApi<any>(`/api/v1/tutor/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    
    if (result?.error) {
      return { error: result.error.message || "Failed to update tutor" };
    }
    
    return { data: result?.data || result, error: null };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
