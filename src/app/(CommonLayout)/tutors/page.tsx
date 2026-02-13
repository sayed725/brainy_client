import { tutorServices } from "@/services/tutor.service";

import { Clock, BookOpen, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import TutorCard from "@/components/modules/tutor/TutorCard";
import PageHeader from "@/components/shared/PageHeader";

// Helper: Get initials from name
function getInitials(name: string | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper: Render star rating
function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalf
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300 dark:text-gray-500"
          }`}
        />
      ))}
    </div>
  );
}

// Helper: Truncate text with ellipsis
function truncate(text: string | undefined | null, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default async function Tutors() {
  const { data } = await tutorServices.getAllTutors();

  // console.log(data);

  if (!data?.data || data.data.length === 0) {
    return (
      <section className="py-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto w-11/12 lg:w-full lg:px-0 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No tutors found
          </h2>
          <p className="mt-4 text-muted-foreground">
            Please check back later.
          </p>
        </div>
      </section>
    );
  }

  const tutors = data.data;

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto w-11/12 lg:w-full lg:px-0">
        {/* Header */}
          <PageHeader title="Pick A Tutor To Get Started" subtitle="All Tutors"/>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tutors.map((tutor: any, index: number) => (
          <TutorCard key={tutor.id || index} tutor={tutor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}