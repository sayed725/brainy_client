import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await fetchApi("/api/v1/user");
      return extractData(result);
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
