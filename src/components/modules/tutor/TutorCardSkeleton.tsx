import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen } from "lucide-react";

export function TutorCardSkeleton() {
  return (
    <Card
      className="
        overflow-hidden border border-gray-200 dark:border-gray-800
        bg-card
        shadow-sm
      "
    >
      {/* Poster / Header area */}
      <div className="relative h-32 bg-muted overflow-hidden">
        <Skeleton className="h-full w-full" />
        
        {/* Fake availability badge */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        
        {/* Fake category badge */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      <CardContent className="relative pt-6 pb-4 px-3 h-[260px]">
        <div>
          {/* Overlapping avatar */}
          <div className="absolute -top-12 left-5">
            <Avatar className="h-16 w-16 border-4 border-card">
              <AvatarFallback className="bg-muted">
                <Skeleton className="h-9 w-9 rounded-full" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Name & Title */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-4/5 rounded" />
              <Skeleton className="h-4 w-3/5 rounded" />
            </div>

            {/* Rating + Bookings */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-16 rounded" />
              </div>
              <Skeleton className="h-4 w-20 rounded" />
            </div>

            {/* Rate */}
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-4 w-14 rounded" />
            </div>

            {/* Bio preview */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>

            {/* Button */}
            <Skeleton className="h-9 w-full rounded-md mt-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}