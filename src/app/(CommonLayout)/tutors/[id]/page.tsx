"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Clock, Star, User, Calendar, Mail, GraduationCap, ArrowLeft, BookOpen, Users } from "lucide-react";
import { fetchApi } from "@/lib/fetch-api";
import Link from "next/link";
import { TutorBooking } from "@/components/modules/tutor/TutorBooking";
import { useQuery } from "@tanstack/react-query";
import { TutorDetailsSkeleton } from "@/components/modules/tutor/TutorDetailsSkeleton";
import { cn } from "@/lib/utils";

// Optional: Type for better safety (you can expand it)
export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
}

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
  reviews: Review[];
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

export default function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: tutor, isLoading, error } = useQuery<Tutor>({
    queryKey: ["tutor", id],
    queryFn: async () => {
      const result = await fetchApi<any>(`/api/v1/tutor/${id}`);
      if (result.error || !result.data) {
        throw new Error(result.error?.message || "Tutor not found");
      }
      return result.data;
    }
  });

  if (isLoading) {
    return <TutorDetailsSkeleton />;
  }

  if (error || !tutor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto container lg:px-0 w-11/12 lg:w-full py-8">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-primary transition-colors">
          <Link href="/tutors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutors
          </Link>
        </Button>

        {/* Hero section */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="relative h-48 md:h-64 bg-muted overflow-hidden group">
            {tutor.poster ? (
              <Image
                src={tutor.poster}
                alt={`${tutor.title} banner`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/5 to-transparent" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>

          {/* Profile info */}
          <div className="relative px-6 pb-8 pt-16 md:px-10 md:pb-10">
            {/* Avatar */}
            <div className="absolute -top-14 left-6 md:left-10">
              <Avatar className="h-28 w-28 border-4 border-card shadow-xl">
                <AvatarImage
                  src={tutor.user.image || undefined}
                  alt={tutor.user.name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {getInitials(tutor.user.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                    {tutor.user.name}
                  </h1>
                  <p className="text-lg font-medium text-muted-foreground mt-1 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {tutor.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    className={cn(
                      "px-3 py-1 text-xs font-semibold",
                      tutor.availability
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tutor.availability ? "Available Now" : "Currently Unavailable"}
                  </Badge>
                  {tutor.categories && (
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      {tutor.categories.name}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rate Card */}
              <div className="flex flex-col items-center md:items-end gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary">${tutor.rate}</span>
                  <span className="text-sm font-medium text-muted-foreground">/ hour</span>
                </div>
                <p className="text-xs text-muted-foreground">Premium Mentorship</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    {renderStars(tutor.averageRating)}
                  </div>
                  <div className="text-2xl font-bold">{tutor.averageRating.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold">{tutor.totalBookIng}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Students</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold">3+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Years</div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold truncate max-w-full">Email</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Contact</div>
                </CardContent>
              </Card>
            </div>

            {/* Bio Section */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">About {tutor.user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-6" />
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {tutor.bio}
                </p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Student Reviews</h3>
                <Badge variant="outline" className="text-primary border-primary/20">
                  {tutor.reviews?.length || 0} Reviews
                </Badge>
              </div>

              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="grid gap-4">
                  {tutor.reviews.map((review) => (
                    <Card key={review.id} className="border-border/40 bg-card/30">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border">
                              <AvatarImage src={review.user.image || undefined} />
                              <AvatarFallback className="text-xs">{getInitials(review.user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-sm">{review.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2 bg-muted/20">
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <p className="text-sm">No reviews yet. Be the first to book and leave feedback!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <TutorBooking tutor={tutor} />
              
              <Card className="bg-primary/5 border-primary/10 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile Verified
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs text-muted-foreground space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Identity verified
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Background check cleared
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Academic credentials verified
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}