import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TutorCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 shadow-sm py-0">
      {/* Header Image Area */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
        
        {/* Category Badge Placeholder */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Availability Dot Placeholder */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col space-y-3 p-5 pb-5">
        {/* Name & Avatar Row */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Stats & Rating */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-10 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        {/* Bio Preview */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        {/* Footer: Price & CTA */}
        <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-900 flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-2 w-12 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}