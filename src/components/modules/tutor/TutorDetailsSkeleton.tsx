import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function TutorDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto container lg:px-0 w-11/12 lg:w-full py-8 animate-pulse">
        {/* Back button skeleton */}
        <div className="h-10 w-32 bg-muted rounded mb-6" />

        {/* Hero section skeleton */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Banner skeleton */}
          <div className="h-48 md:h-64 bg-muted" />

          {/* Profile info skeleton */}
          <div className="relative px-6 pb-8 pt-16 md:px-10 md:pb-10">
            {/* Avatar skeleton */}
            <div className="absolute -top-14 left-6 md:left-10">
              <div className="h-28 w-28 rounded-full border-4 border-card bg-muted shadow-xl" />
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-10 w-64 bg-muted rounded" />
                  <div className="h-6 w-96 bg-muted rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-24 bg-muted rounded-full" />
                  <div className="h-6 w-28 bg-muted rounded-full" />
                </div>
              </div>

              {/* Rate card skeleton */}
              <div className="h-20 w-40 bg-muted rounded-xl" />
            </div>
          </div>
        </div>

        {/* Main Grid Content Skeleton */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl border border-border/50" />
              ))}
            </div>

            {/* About section skeleton */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <Separator />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>

            {/* Reviews section skeleton */}
            <div className="space-y-6">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted/30 rounded-xl border border-border/40" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="h-[400px] bg-muted rounded-xl border border-border" />
            <div className="h-40 bg-muted rounded-xl border border-border" />
          </div>

        </div>
      </div>
    </main>
  );
}
