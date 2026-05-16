import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

export const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export function useAllUsers(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
 
      const queryString = searchParams.toString();
      const url = `/api/v1/user${queryString ? `?${queryString}` : ""}`;
      const result = await fetchApi(url);
      return result; // Return raw result to access meta
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: any }) => {
      return fetchApi(`/api/v1/user/${id}`, {
        method: "PATCH",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/api/v1/user/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
