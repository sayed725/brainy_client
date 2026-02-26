import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TutorProfileSkelton() {
    return (
       <div className="px-0 lg:px-6 pb-16 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-muted rounded" />
            <div className="h-5 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Main Profile Card Skeleton */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar Skeleton */}
              <div className="shrink-0">
                <div className="h-32 w-32 rounded-full bg-muted border-4 border-primary/30 shadow-md" />
              </div>

              {/* Basic Info Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-10 w-3/4 bg-muted rounded" />
                  <div className="h-7 w-1/2 bg-muted rounded" />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-6 w-32 bg-muted rounded" />
                  <div className="h-8 w-28 bg-muted rounded-full" />
                  <div className="h-8 w-28 bg-muted rounded-full" />
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="h-5 w-28 bg-muted rounded" />
                  <div className="h-5 w-28 bg-muted rounded" />
                  <div className="h-5 w-40 bg-muted rounded" />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-10 pt-2">
            {/* Bio Skeleton */}
            <div className="space-y-3">
              <div className="h-7 w-40 bg-muted rounded" />
              <div className="space-y-2">
                <div className="h-5 w-full bg-muted rounded" />
                <div className="h-5 w-full bg-muted rounded" />
                <div className="h-5 w-3/4 bg-muted rounded" />
              </div>
            </div>

            {/* Contact & Location Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-5 w-5 bg-muted rounded-full mt-0.5" />
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-5 w-48 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card/50 p-5 text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-muted" />
                  <div className="h-8 w-20 mx-auto bg-muted rounded" />
                  <div className="mt-1 h-4 w-24 mx-auto bg-muted rounded" />
                </div>
              ))}
            </div>

            {/* Footer Skeleton */}
            <div className="text-sm text-muted-foreground border-t pt-6">
              <div className="h-5 w-56 bg-muted rounded" />
              <div className="mt-1 h-5 w-48 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
}