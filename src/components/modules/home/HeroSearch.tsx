// components/HeroSearch.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoIosSearch } from "react-icons/io";

const THEME_COLOR = "#1cb89e";
const THEME_COLOR_LIGHT = "#e6f9f6"; // very light version for backgrounds
const THEME_COLOR_DARK = "#148f7c";   // darker hover/active variant

const mockSubjects = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Bangla",
  "IELTS / TOEFL",
  "Programming (Python, JS)",
  "Accounting",
  "University Admission Prep",
];

const mockTutors = [
  {
    id: "t1",
    name: "Rahim Uddin",
    subject: "Mathematics",
    level: "Class 9-10, HSC",
    rate: "৳800/hour",
    rating: "4.9",
    experience: "7+ years",
    image: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=800&auto=format&fit=crop",
  },
  {
    id: "t2",
    name: "Sultana Begum",
    subject: "English",
    level: "Spoken, IELTS",
    rate: "৳1,200/hour",
    rating: "4.8",
    experience: "5 years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
  },
  // ... add more mock tutors as needed
];

export default function HeroSearch() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTutors = mockTutors.filter((tutor) => {
    const matchSearch =
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !subject || tutor.subject === subject;
    return matchSearch && matchSubject;
  });

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-40">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search tutors by subject, name or topic..."
          className={`
            w-full pl-12 pr-32 py-2 
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

        {(search || subject) ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSubject(null);
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
              bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white text-sm font-medium transition-all
            `}
            style={{
              backgroundColor: THEME_COLOR,
              borderColor: THEME_COLOR,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME_COLOR_DARK;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = THEME_COLOR;
            }}
          >
            Find Tutor
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      <div
        className={`
          absolute top-full left-0 right-0 mt-3 
          bg-gray-100 dark:bg-gray-900 
          rounded-xl shadow-2xl dark:shadow-black/60 
          border border-gray-200 dark:border-gray-700 
          overflow-hidden
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="p-5 max-h-[460px] overflow-y-auto">
          {/* Subject chips */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular Subjects</p>
            <div className="flex flex-wrap gap-2">
              {mockSubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubject(sub === subject ? null : sub)}
                  className={`
                    px-4 py-2 text-sm rounded-full border transition-all
                    ${
                      subject === sub
                        ? "font-medium shadow-sm border-teal-600 dark:border-teal-500"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }
                  `}
                  style={
                    subject === sub
                      ? {
                          backgroundColor: THEME_COLOR_LIGHT,
                          borderColor: THEME_COLOR,
                          color: THEME_COLOR_DARK,
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "inherit",
                        }
                  }
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Tutor list */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Available Tutors</p>

          {filteredTutors.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              No tutors found for your search. Try different keywords or subjects.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className={`
                    flex items-center justify-between p-4 
                    rounded-lg border 
                    border-gray-100 dark:border-gray-700 
                    hover:border-gray-200 dark:hover:border-gray-600 
                    transition-colors
                    bg-white/50 dark:bg-gray-800/40
                  `}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{tutor.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tutor.subject} • {tutor.level}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className="text-lg font-bold mb-1"
                      style={{ color: THEME_COLOR }}
                    >
                      {tutor.rate}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>★ {tutor.rating}</span>
                      <span>• {tutor.experience}</span>
                    </div>

                    <Button
                      size="sm"
                      asChild
                      variant="outline"
                      className={`
                        text-xs px-4 
                        border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-gray-300 
                        hover:bg-gray-50 dark:hover:bg-gray-800
                      `}
                      style={{
                        "--tw-ring-color": THEME_COLOR,
                        "--tw-ring-opacity": "0.3",
                      } as React.CSSProperties}
                    >
                      <Link href={`/tutor/${tutor.id}`}>
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