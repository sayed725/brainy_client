"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TutorCard from "@/components/modules/tutor/TutorCard";
import TutorsSearchHeader from "@/components/modules/tutor/TutorsSearchHeader";
import TutorsSidebar from "@/components/modules/tutor/TutorsSidebar";
import TutorsLoadingSkeleton, { TutorGridSkeleton, TutorsSidebarSkeleton } from "@/components/modules/tutor/TutorsLoadingSkeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { useAllTutors } from "@/hooks/useTutors";
import { useCategories, extractData } from "@/hooks/useCategories";
import { Tutor, Category } from "@/constants/otherinterface";

function TutorsGrid({ tutors, isLoading }: { tutors: Tutor[], isLoading: boolean }) {
  if (isLoading) {
    return <TutorGridSkeleton count={8} />;
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-20 bg-card border rounded-xl shadow-sm">
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold">No tutors found</h2>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        <Button asChild className="mt-6 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white rounded-xl shadow-lg hover:shadow-[#1cb89e]/25 transition-all duration-300 font-semibold px-6 hover:scale-105 border-0">
          <Link href="/tutors">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {tutors.map((tutor, index) => (
        <TutorCard key={tutor.id || index} tutor={tutor} index={index} />
      ))}
    </div>
  );
}

function TutorsPageContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm")?.toLowerCase() || "";
  const categoryName = searchParams.get("categoryName") || "";
  const isAvailable = searchParams.get("isAvailable") === "true";
  const sortBy = searchParams.get("sortBy") || "newest";

  const { data: tutors = [], isLoading: isLoadingTutors } = useAllTutors();
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories();
  const categories = useMemo(() => extractData(categoriesResponse) as Category[], [categoriesResponse]);

  // Filtering + Sorting logic (memoized)
  const filteredTutors = useMemo(() => {
    let result = [...tutors];

    // 1. Search
    if (searchTerm) {
      result = result.filter((t) => {
        const nameMatch = t.user?.name?.toLowerCase().includes(searchTerm);
        const titleMatch = t.title?.toLowerCase().includes(searchTerm);
        const catMatch = t.categories?.name?.toLowerCase().includes(searchTerm);
        return nameMatch || titleMatch || catMatch;
      });
    }

    // 2. Category filter
    if (categoryName) {
      result = result.filter((t) => t.categories?.name === categoryName);
    }

    // 3. Availability filter
    if (isAvailable) {
      result = result.filter((t) => t.availability === true);
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name-asc":
          return (a.user?.name || "").localeCompare(b.user?.name || "");
        case "name-desc":
          return (b.user?.name || "").localeCompare(a.user?.name || "");
        case "rate-desc":
          return (b.rate || 0) - (a.rate || 0);
        case "bookings-desc":
          return (b.totalBookIng || 0) - (a.totalBookIng || 0);
        case "rating-desc":
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [tutors, searchTerm, categoryName, isAvailable, sortBy]);

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <TutorsSearchHeader>
        {/* Mobile Filter Button */}
        <div className="lg:hidden shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/20 text-[#1cb89e] transition-colors h-10">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 overflow-y-auto" showCloseButton={false}>
              <SheetHeader className="p-4 border-b flex flex-row items-center justify-between bg-muted/50 space-y-0">
                <SheetTitle>Categories & Filters</SheetTitle>
               <SheetClose className="rounded-xl p-2 hover:bg-[#1cb89e]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1cb89e] border border-transparent hover:border-[#1cb89e]/20">
                                    <X className="h-5 w-5 text-slate-500 hover:text-[#1cb89e]" />
                                    <span className="sr-only">Close</span>
                                  </SheetClose>
              </SheetHeader>
              <div className="p-4">
                {isLoadingCategories ? (
                  <TutorsSidebarSkeleton />
                ) : (
                  <TutorsSidebar categories={categories} />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </TutorsSearchHeader>

      <div className="flex flex-col lg:flex-row gap-8 mt-4 lg:mt-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          {isLoadingCategories ? (
            <TutorsSidebarSkeleton />
          ) : (
            <TutorsSidebar categories={categories} />
          )}
        </div>

        <div className="flex-1">
          {/* Results count */}
          {!isLoadingTutors && (
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""}
              {(searchTerm || categoryName || isAvailable) && " • filtered"}
            </p>
          )}
          <TutorsGrid tutors={filteredTutors} isLoading={isLoadingTutors} />
        </div>
      </div>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={<TutorsLoadingSkeleton />}>
      <TutorsPageContent />
    </Suspense>
  );
}