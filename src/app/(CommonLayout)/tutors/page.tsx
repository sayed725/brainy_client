"use client";

import { useEffect, useState, useMemo } from "react";
import { Clock, Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import TutorCard from "@/components/modules/tutor/TutorCard";
import PageHeader from "@/components/shared/PageHeader";
import { getAllTutors } from "@/actions/tutor.action";
import { getCategories } from "@/actions/category.action";
import { Tutor } from "@/constants/otherinterface";
import { TutorCardSkeleton } from "@/components/modules/tutor/TutorCardSkeleton";

type Category = {
  id: number;
  name: string;
  slug: string | null;
};

type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "rate-desc"
  | "bookings-desc"     // ← new
  | "rating-desc";      // ← new

export default function Tutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [categories, setCategories] = useState<Category[]>([]);

  // Load tutors
  useEffect(() => {
    async function loadTutors() {
      setLoading(true);
      setError(null);
      try {
        const result = await getAllTutors();
        if (result.error) throw new Error(result.error);
        setTutors(result.data?.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load tutors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTutors();
  }, []);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        if (res?.data?.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Filtering + Sorting logic (memoized)
  const processedTutors = useMemo(() => {
    let result = [...tutors];

    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => {
        const nameMatch = t.user?.name?.toLowerCase().includes(q);
        const titleMatch = t.title?.toLowerCase().includes(q);
        const catMatch = t.categories?.name?.toLowerCase().includes(q);
        return nameMatch || titleMatch || catMatch;
      });
    }

    // 2. Category filter
    if (selectedCategoryId !== "all") {
      const catId = Number(selectedCategoryId);
      result = result.filter((t) => t.categoryId === catId);
    }

    // 3. Sort
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
  }, [tutors, searchQuery, selectedCategoryId, sortBy]);

  useEffect(() => {
    setFilteredTutors(processedTutors);
  }, [processedTutors]);

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="mt-4 text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader title="Pick A Tutor To Get Started" subtitle="All Tutors" />

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between flex-wrap">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category */}
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort – now with more options */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A–Z</SelectItem>
              <SelectItem value="name-desc">Name Z–A</SelectItem>
              <SelectItem value="rate-desc">Highest Price</SelectItem>
              <SelectItem value="rating-desc">Top Rated</SelectItem>
              <SelectItem value="bookings-desc">Most Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""}
            {(searchQuery || selectedCategoryId !== "all") && " • filtered"}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <TutorCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium">No tutors found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredTutors.map((tutor, index) => (
              <TutorCard key={tutor.id || index} tutor={tutor} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}