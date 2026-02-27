// components/PopularTutors.tsx

import { Suspense } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tutorServices } from "@/services/tutor.service";
import PageHeader from "@/components/shared/PageHeader";
import TutorCard from "../tutor/TutorCard";
import { TutorCardSkeleton } from "../tutor/TutorCardSkeleton"; // ← import the skeleton you created
import Link from "next/link";

// Minimal type (expand as needed)
interface Tutor {
  id: string;
  title: string;
  bio?: string | null;
  rate: number;
  timeSlots?: string[];
  availability: boolean;
  poster?: string | null;
  averageRating: number;
  totalBookIng: number;
  categories?: { name: string } | null;
  user: {
    name: string;
    image?: string | null;
  };
}

async function PopularTutorsContent() {
  const result = await tutorServices.getAllTutors();

  // Optional: better error handling / empty state
  if (!result || result.error || !result.data?.data || result.data.data.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-semibold mb-3">No tutors found</h3>
        <p className="text-muted-foreground">
          {result?.error?.message || "Check back later or try different filters."}
        </p>
      </div>
    );
  }

  const popularTutors = result.data.data.slice(0, 8);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {popularTutors.map((tutor: Tutor, index: number) => (
        <TutorCard key={tutor.id || index} tutor={tutor} index={index} />
      ))}
    </div>
  );
}

export default async function PopularTutors() {
  return (
    <section className="py-10  bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header – always visible */}
        <PageHeader title="Pick A Tutor To Get Started" subtitle="Popular Tutors" />

        {/* Content with loading fallback */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <TutorCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <PopularTutorsContent />
        </Suspense>

        {/* Browse More Button – shown immediately (optimistic UI) */}
        <div className="mt-10 text-center">
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg group transition-all duration-300"
          >
           <Link href='/tutor' className="flex items-center gap-2">
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