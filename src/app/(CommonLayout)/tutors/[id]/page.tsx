import { notFound } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Clock, Star, User, Calendar, Mail } from "lucide-react";
import { tutorServices } from "@/services/tutor.service";

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

export default async function TutorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await tutorServices.getSingleTutor(id);

  if (result.error || !result.data) {
    console.error("Tutor fetch error:", result.error);
    notFound();
  }

  const tutor: Tutor = result.data;

  // Format time slots
  const timeSlotsFormatted = Array.isArray(tutor.timeSlots) && tutor.timeSlots.length > 0
    ? tutor.timeSlots
        .map((slot) => slot.charAt(0) + slot.slice(1).toLowerCase())
        .join(", ")
    : "Not specified";

  // Format join date nicely
  const joinDate = new Date(tutor.user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Hero / Header Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Poster / Image */}
        <div className="md:col-span-1">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border shadow-xl">
            {tutor.poster ? (
              <Image
                src={tutor.poster}
                alt={`${tutor.title} - ${tutor.user.name}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-900">
                <User className="h-28 w-28 text-white/50" />
              </div>
            )}
          </div>
        </div>

        {/* Main Info */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{tutor.title}</h1>
            <p className="text-xl text-muted-foreground mt-3">
              by <span className="font-semibold text-foreground">{tutor.user.name}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {tutor.categories?.name && (
              <Badge variant="secondary" className="text-base px-4 py-1.5">
                {tutor.categories.name}
              </Badge>
            )}
            <Badge variant="outline" className="text-base px-4 py-1.5 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {tutor.averageRating} ({tutor.totalBookIng} bookings)
            </Badge>
            <Badge
              variant={tutor.availability ? "default" : "secondary"}
              className="text-base px-4 py-1.5"
            >
              {tutor.availability ? "Available Now" : "Currently Unavailable"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-6 text-lg font-medium">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>${tutor.rate}/hr</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>{timeSlotsFormatted}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="flex-1">
              Book a Session
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Message Tutor
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Bio & Details */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Left - Bio Section */}
        <div className="md:col-span-2 space-y-10">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-2xl">About {tutor.user.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <p className="text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                {tutor.bio || "This tutor has not added a bio yet."}
              </p>
            </CardContent>
          </Card>

          {/* You can add more sections here later */}
          {/* e.g. Reviews, Qualifications, Teaching Experience */}
        </div>

        {/* Sidebar - Tutor Info + Availability */}
        <div className="space-y-8">
          {/* Tutor Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tutor Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-background">
                  <AvatarImage src={tutor.user.image || undefined} alt={tutor.user.name} />
                  <AvatarFallback className="bg-teal-700 text-white text-2xl font-semibold">
                    {tutor.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{tutor.user.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {tutor.user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Member since</p>
                  <p className="font-medium">{joinDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="outline" className="mt-1">
                    {tutor.user.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <Badge variant="secondary" className="mt-1">
                    {tutor.user.role.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tutor.timeSlots?.length > 0 ? (
                  tutor.timeSlots.map((slot: string) => (
                    <Badge key={slot} variant="secondary" className="text-sm px-3 py-1">
                      {slot.charAt(0) + slot.slice(1).toLowerCase()}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specific time slots listed</p>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium">
                  Currently:{" "}
                  <span className={tutor.availability ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                    {tutor.availability ? "Available" : "Unavailable"}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(tutor.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}