import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Star } from "lucide-react";
import Link from "next/link";

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


export default function TutorCard({tutor, index}: {tutor: any, index: number}) {


    return (
        <Card
              key={tutor.id || index}
              className="group overflow-hidden border border-gray-200 dark:border-gray-800 
                         hover:border-teal-500/50 dark:hover:border-teal-500/50 
                         transition-all duration-300 group hover:shadow-xl hover:shadow-teal-500/10 p-0"
            >
              {/* Poster / Header */}
              <div className="relative h-32 bg-muted overflow-hidden">
                {tutor.poster ? (
                  <img
                    src={tutor.poster}
                    alt={`${tutor.title} poster`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary/10 to-primary/5" />
                )}
                {/* Availability badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    className={
                      tutor.availability
                        ? "border-transparent bg-[#1cb89e] text-white hover:bg-emerald-500/90"
                        : "border-transparent bg-muted-foreground/60 text-white hover:bg-muted-foreground/60"
                    }
                  >
                    {tutor.availability ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                {/* Category badge */}
                {tutor.categories && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-background/80 backdrop-blur-sm text-foreground font-bold"
                    >
                      {tutor.categories.name}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="relative pt-6 pb-3 px-3 h-65">
               <div>
                 {/* Avatar overlapping header */}
                <div className="absolute -top-12 left-5">
                  <Avatar className="h-16 w-16 border-4 border-card shadow-md">
                    <AvatarImage
                      src={tutor.user?.image || undefined}
                      alt={tutor.user?.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {getInitials(tutor.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Tutor Info */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 flex-1">
                    <h3 className="text-base font-semibold text-foreground leading-tight text-pretty">
                      {truncate(tutor.user?.name, 25) || "Unknown Tutor"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {truncate(tutor.title, 35) || "No title"}
                    </p>
                  </div>

                  {/* Rating & Bookings */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {renderStars(tutor.averageRating || 0)}
                      <span className="ml-1 text-xs font-medium text-foreground">
                        {(tutor.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>
                        {tutor.totalBookIng || 0}{" "}
                        {(tutor.totalBookIng || 0) === 1 ? "booking" : "bookings"}
                      </span>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      ${tutor.rate || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">/ hour</span>
                  </div>

                  {/* Bio preview - limited to 100 chars */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {truncate(tutor.bio, 100) || "No bio available"}
                  </p>
               </div>

                  {/* Details Button */}
                  <Button size="sm"  asChild className="mt-4 w-full text-sm font-medium bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white">
                    <Link href={`/tutors/${tutor.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
    );
}