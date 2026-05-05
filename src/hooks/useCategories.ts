import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // We must pass sortBy: "id" because the backend fails trying to sort by non-existent "createdAt"
      const result = await fetchApi("/api/v1/categories", {
        params: { sortBy: "id", sortOrder: "asc", limit: 100, isActive: true }
      });
      return extractData(result);
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: { name: string; slug?: string }) => {
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
