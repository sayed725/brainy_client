// components/PopularCourses.tsx

import { Clock, BookOpen, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TutorCard from "../tutor/TutorCard";
import { tutorServices } from "@/services/tutor.service";

// Minimal type for safety (expand as needed)
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
  // ... other fields your TutorCard uses
}

export default async function PopularTutors() {
  const result = await tutorServices.getAllTutors();

  // Debug log (remove or conditional in production)
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Popular tutors result:", result);
  // }

  // Handle loading/error/no data
  if (!result || result.error || !result.data?.data || result.data.data.length === 0) {
    return (
      <section className="py-10 md:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Tutors
          </h2>
          <p className="text-lg text-muted-foreground">
            {result?.error?.message || "No popular tutors available right now"}
          </p>
        </div>
      </section>
    );
  }

  const popularTutors: Tutor[] = result.data.data;

  return (
    <section className="py-10 md:py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-teal-600 dark:text-teal-400 font-medium">
            Popular Tutors
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Pick A Tutor To Get Started
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-teal-500/70 rounded-full"></div>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {popularTutors.map((tutor: Tutor, index: number) => (
            <TutorCard key={tutor.id || index} tutor={tutor} index={index} />
          ))}
        </div>

        {/* Browse More Button */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg group transition-all duration-300"
          >
            Browse more courses
            <ChevronRight
              className="ml-2 transition-transform group-hover:translate-x-1"
              size={20}
            />
          </Button>
        </div>
      </div>
    </section>
  );
}