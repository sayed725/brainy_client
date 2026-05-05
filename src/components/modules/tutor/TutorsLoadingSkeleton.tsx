"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { TutorCardSkeleton } from "./TutorCardSkeleton"

export function TutorGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <TutorCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TutorsSidebarSkeleton() {
  return (
    <div className="w-full lg:w-64 space-y-4">
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

export default function TutorsLoadingSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row justify-between mb-8 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-full lg:w-80" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <TutorsSidebarSkeleton />
        <div className="flex-1">
          <TutorGridSkeleton count={8} />
        </div>
      </div>
    </div>
  )
}
