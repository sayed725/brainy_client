// components/HeroSearch.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import { getCategories } from "@/actions/category.action";
import { getAllTutors } from "@/actions/tutor.action";
import { Tutor } from "@/constants/otherinterface";

const THEME_COLOR = "#1cb89e";
const THEME_COLOR_LIGHT = "#e6f9f6";
const THEME_COLOR_DARK = "#148f7c";

type Category = {
  id: number;
  name: string;
  slug: string | null;
};

export default function HeroSearch() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories – limit to 5 most popular/recent
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        if (res?.data?.data) {
          setCategories(res.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch all tutors once
  useEffect(() => {
    async function loadTutors() {
      setLoading(true);
      setError(null);
      try {
        const result = await getAllTutors();
        if (result.error) {
          throw new Error(result.error);
        }
        setTutors(result.data?.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load available tutors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTutors();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered tutors – memoized for performance
  const filteredTutors = useMemo(() => {
    if (!tutors.length) return [];

    const lowerSearch = search.toLowerCase().trim();

    return tutors.filter((tutor) => {
      // Text search in name, title, bio
      const searchMatch =
        !lowerSearch ||
        tutor?.user?.name?.toLowerCase().includes(lowerSearch) ||
        tutor.title?.toLowerCase().includes(lowerSearch) ||
        tutor.bio?.toLowerCase().includes(lowerSearch);

      // Category filter – single object, not array!
      const categoryMatch =
        !selectedCategory ||
        tutor.categories?.name === selectedCategory;

      return searchMatch && categoryMatch;
    });
  }, [tutors, search, selectedCategory]);

  const hasActiveFilter = !!search.trim() || !!selectedCategory;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-40">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search tutors by subject, name, topic..."
          className={`
            w-full pl-12 pr-32 py-3 
            bg-gray-100 dark:bg-gray-800/90 
            border border-gray-300 dark:border-gray-600 
            rounded-xl text-lg 
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            shadow-sm focus:outline-none focus:ring-2 transition-all
          `}
          style={{
            "--tw-ring-color": THEME_COLOR,
            "--tw-ring-opacity": "0.4",
          } as React.CSSProperties}
        />

        <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl" />

        {hasActiveFilter ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 text-sm 
              border-gray-300 dark:border-gray-600 
              hover:border-gray-400 dark:hover:border-gray-500
              dark:text-gray-300
            `}
          >
            Clear
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 
              bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white text-sm font-medium
            `}
            style={{ backgroundColor: THEME_COLOR, borderColor: THEME_COLOR }}
          >
            Find Tutor
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      <div
        className={`
          absolute top-full left-0 right-0 mt-3 
          bg-white dark:bg-gray-900 
          rounded-xl shadow-2xl dark:shadow-black/60 
          border border-gray-200 dark:border-gray-700 
          overflow-hidden
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="p-5 max-h-[460px] overflow-y-auto">
          {/* Popular Subjects Chips */}
          {categories.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Popular Subjects
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.name ? null : cat.name
                      )
                    }
                    className={`
                      px-4 py-2 text-sm rounded-full border transition-all
                      ${
                        selectedCategory === cat.name
                          ? "font-medium shadow-sm border-teal-600 dark:border-teal-500"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                    `}
                    style={
                      selectedCategory === cat.name
                        ? {
                            backgroundColor: THEME_COLOR_LIGHT,
                            borderColor: THEME_COLOR,
                            color: THEME_COLOR_DARK,
                          }
                        : {}
                    }
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tutors List */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Available Tutors
          </p>

          {loading ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              Loading available tutors...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              {selectedCategory || search.trim()
                ? "No tutors match your selection. Try another subject or keyword."
                : "No tutors available at the moment."}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className={`
                    flex flex-col sm:flex-row items-start sm:items-center justify-between 
                    p-4 rounded-lg border border-gray-100 dark:border-gray-700 
                    hover:border-gray-200 dark:hover:border-gray-600 
                    transition-colors bg-white/50 dark:bg-gray-800/40 gap-4
                  `}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={
                        tutor.poster ||
                        tutor.user?.image ||
                        "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=800&auto=format&fit=crop"
                      }
                      alt={`${tutor.user?.name || "Tutor"} profile`}
                      className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {tutor.user?.name || "Tutor"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tutor.title || tutor.categories?.name || "Subject not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right w-full sm:w-auto mt-3 sm:mt-0">
                    <div
                      className="text-lg font-bold mb-1"
                      style={{ color: THEME_COLOR }}
                    >
                      ৳{tutor.rate || "?"}/hour
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {tutor.averageRating ? (
                        <>
                          <span>★ {tutor.averageRating.toFixed(1)}</span>
                          <span>• {tutor.totalBookIng || 0} bookings</span>
                        </>
                      ) : (
                        <span>New Tutor</span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      asChild
                      variant="outline"
                      className="text-xs px-4"
                      style={{ "--tw-ring-color": THEME_COLOR, "--tw-ring-opacity": "0.3" } as any}
                    >
                      <Link href={`/tutors/${tutor.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}