"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import ReviewsClient from "./ReviewsClient";
import { ReviewCardSkeleton } from "./ReviewCardSkeleton";
import SectionHeader from "@/components/shared/SectionHeader";

const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export default function Reviews() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetchApi<any>("/api/v1/review", { 
        params: { sortBy: "id" }
      });
      return extractData(res);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        <div className="mb-10 text-center flex flex-col items-center">
          <SectionHeader
            title="What Our Students Say" 
            badge="Student Reviews"
            description="Read real experiences from students who have transformed their learning with our expert tutors."
            descriptionClassName="hidden lg:block"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ReviewsClient reviews={reviews} />
        )}
      </div>
    </section>
  );
}