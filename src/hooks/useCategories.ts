import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

export const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export function useCategories(params?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const result = await fetchApi("/api/v1/categories", {
        params: { 
          sortBy: "id", 
          sortOrder: "asc", 
          limit: 10, 
          isActive: true,
          ...params 
        }
      });
      return result; // Return full result to access meta
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: { name: string; slug?: string; image?: string }) => {
      return fetchApi("/api/v1/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: { name?: string; slug?: string; image?: string } }) => {
      return fetchApi(`/api/v1/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryId: number | string) => {
      return fetchApi(`/api/v1/categories/${categoryId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
