"use server";

import { fetchApi } from "@/lib/fetch-api";

export const getCategories = async () => {
  try {
    const result = await fetchApi<any>("/api/v1/categories", {
      params: { 
        limit: 100, 
        sortBy: "id", 
        isActive: true 
      }
    });
    return { data: result?.data || result, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Failed to fetch categories" };
  }
};
