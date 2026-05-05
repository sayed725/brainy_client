import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";

const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const result = await fetchApi("/api/v1/review");
      return extractData(result);
    },
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: { rating: number; comment?: string | null; tutorId: string; bookingId: string; userId: string }) => {
      return fetchApi("/api/v1/review", {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
