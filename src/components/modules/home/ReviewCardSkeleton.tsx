import { Skeleton } from "@/components/ui/skeleton";

export function ReviewCardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8 h-full flex flex-col">
      {/* Quote Icon Placeholder */}
      <div className="flex justify-start mb-6">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>

      {/* Stars Placeholder */}
      <div className="flex justify-start gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-5 h-5 rounded-full" />
        ))}
      </div>

      {/* Comment Placeholder */}
      <div className="space-y-3 mb-8 flex-grow">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-9/12 rounded" />
      </div>

      {/* Footer Placeholder */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6 mt-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>

        <div className="text-right space-y-1">
          <Skeleton className="h-2 w-4 ml-auto rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
