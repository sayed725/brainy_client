import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Clock, Star, User, Calendar, Mail, GraduationCap, ArrowLeft, BookOpen } from "lucide-react";
import { tutorServices } from "@/services/tutor.service";
import Link from "next/link";
import { TutorBooking } from "@/components/modules/tutor/TutorBooking";
import { bookingServices } from "@/services/booking.service";

// Optional: Type for better safety (you can expand it)
export interface Tutor {
  id: string;
  title: string;
  bio: string;
  rate: number;
  timeSlots: string[];
  availability: boolean;
  poster: string | null;
  averageRating: number;
  totalBookIng: number;
  categoryId: number;
  categories: { id: number; name: string; slug: string | null } | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    emailVerified: boolean;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

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

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await tutorServices.getSingleTutor(id);

  // const bookingResult = await bookingServices.getBookingsByTutorId(id);

  // console.log("Booking Result for Tutor ID", id, ":", bookingResult); 



  


  if (result.error || !result.data) {
    console.error("Tutor fetch error:", result.error);
    notFound();
  }

  const tutor: Tutor = result.data;

//   console.log("Tutor data:", tutor);



 

  return (
       <main className="min-h-screen bg-background">
      

      <div className="mx-auto container lg:px-0 w-11/12 lg:w-full py-8">
        {/* Back button */}
        <Button asChild  variant="ghost" className="mb-6 -ml-2 text-muted-foreground">
          <Link href="/tutors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutors
          </Link>
        </Button>

        {/* Hero section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Banner */}
          <div className="relative h-40 md:h-48 bg-muted overflow-hidden">
            {tutor.poster ? (
              <img
                src={tutor.poster}
                alt={`${tutor.title} banner`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-primary/15 via-primary/5 to-transparent" />
            )}
          </div>

          {/* Profile info */}
          <div className="relative px-6 pb-6 pt-12 md:px-8 md:pb-8">
            {/* Avatar */}
            <div className="absolute -top-10 left-6 md:left-8">
              <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                <AvatarImage
                  src={tutor.user.image || undefined}
                  alt={tutor.user.name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                  {getInitials(tutor.user.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-foreground text-balance">
                    {tutor.user.name}
                  </h2>
                  <p className="text-base text-muted-foreground mt-0.5">
                    {tutor.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    className={
                      tutor.availability
                        ? "border-transparent bg-emerald-500/90 text-white hover:bg-emerald-500/90"
                        : "border-transparent bg-muted-foreground/60 text-white hover:bg-muted-foreground/60"
                    }
                  >
                    {tutor.availability ? "Available" : "Unavailable"}
                  </Badge>
                  {tutor.categories && (
                    <Badge variant="outline">{tutor.categories.name}</Badge>
                  )}
                </div>
              </div>

              {/* Rate badge on right */}
              <div className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2.5">
                <Clock className="h-4 w-4 text-[#1cb89e]" />
                <span className="text-lg font-bold text-foreground">
                  ${tutor.rate}
                </span>
                <span className="text-sm text-muted-foreground">/ hour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1">
              {renderStars(tutor.averageRating)}
            </div>
            <span className="mt-2 text-lg font-semibold text-foreground">
              {tutor.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">Average Rating</span>
          </div>
           <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
            <BookOpen className="h-5 w-5 text-[#1cb89e]" />
            <span className="mt-2 text-lg font-semibold text-foreground">
              3
            </span>
            <span className="text-xs text-muted-foreground">Years of Experience</span>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
            <BookOpen className="h-5 w-5 text-[#1cb89e]" />
            <span className="mt-2 text-lg font-semibold text-foreground">
              {tutor.totalBookIng}
            </span>
            <span className="text-xs text-muted-foreground">Total Bookings</span>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-border bg-card p-4">
            <Mail className="h-5 w-5 text-[#1cb89e]" />
            <span className="mt-2 text-sm font-medium text-foreground truncate max-w-full">
              {tutor.user.email}
            </span>
            <span className="text-xs text-muted-foreground">Contact</span>
          </div>
        </div>

        {/* About section */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-3">
            About
          </h3>
          <Separator className="mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tutor.bio}
          </p>
        </div>

        {/* Booking section */}
        <div className="mt-6">
          <TutorBooking tutor={tutor} />
        </div>
      </div>
    </main>
  );
}