import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { Tutor } from "@/constants/otherinterface";

const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

const extractSingle = (result: any): any => {
  return result?.data?.data || result?.data || result;
};

export function useAllTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const result = await fetchApi("/api/v1/tutor");
      return extractData(result) as Tutor[];
    },
  });
}

export function useTutor(id?: string) {
  return useQuery({
    queryKey: ["tutors", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await fetchApi(`/api/v1/tutor/${id}`);
      return extractSingle(result) as Tutor;
    },
    enabled: !!id,
  });
}

export function useTutorByUserId(userId?: string) {
  return useQuery({
    queryKey: ["tutors", "user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const result = await fetchApi(`/api/v1/tutor/byUserId/${userId}`);
      return extractSingle(result) as Tutor;
    },
    enabled: !!userId,
  });
}

export function useCreateTutor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tutorData: any) => {
      return fetchApi("/api/v1/tutor", {
        method: "POST",
        body: JSON.stringify(tutorData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors"] });
    },
  });
}

export function useUpdateTutor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, tutorData }: { id: string; tutorData: any }) => {
      return fetchApi(`/api/v1/tutor/${id}`, {
        method: "PATCH",
        body: JSON.stringify(tutorData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutors"] });
    },
  });
}
