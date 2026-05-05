"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import SectionHeader from "@/components/shared/SectionHeader";
import TutorCard from "../tutor/TutorCard";
import { TutorCardSkeleton } from "../tutor/TutorCardSkeleton";
import Link from "next/link";

const extractData = (result: any): any[] => {
  const data = result?.data?.data || result?.data || result;
  return Array.isArray(data) ? data : [];
};

export default function PopularTutors() {
  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["popularTutors"],
    queryFn: async () => {
      const result = await fetchApi<any>("/api/v1/tutor", {
        params: { sortBy: "id", sortOrder: "asc" }
      });
      return extractData(result);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const popularTutors = tutors.slice(0, 8);

  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header – always visible */}
        <div className="mb-10 text-center flex flex-col items-center">
          <SectionHeader
            title="Pick A Tutor To Get Started"
            badge="Popular Tutors"
            description="Our most highly-rated and experienced tutors ready to help you succeed."
            descriptionClassName="hidden lg:block"
          />
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <TutorCardSkeleton key={i} />
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold mb-3">No tutors found</h3>
            <p className="text-muted-foreground">Check back later or try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularTutors.map((tutor, index) => (
              <TutorCard key={tutor.id || index} tutor={tutor} index={index} />
            ))}
          </div>
        )}

        {/* Browse More Button */}
        <div className="mt-10 text-center">
          <Button
            size="lg"
            asChild
            className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white px-8 py-6 text-lg group transition-all duration-300 rounded-xl"
          >
            <Link href='/tutors' className="flex items-center gap-2">
              Browse more tutors
              <ChevronRight
                className="ml-2 transition-transform group-hover:translate-x-1"
                size={20}
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}