// components/PopularCourses.tsx


import { Clock, BookOpen, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    title: "Starting SEO as your Home Based Business",
    level: "Beginner",
    duration: "15 Weeks",
    lessons: 11,
    students: 227,
    rating: 5.0,
    ratingsCount: 3,
    price: 30,
    image: "https://images.unsplash.com/photo-1497366757868-1d7a7d097e7e?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Grow Personal Financial Security Thinking &...",
    level: "Expert",
    duration: "12 Weeks",
    lessons: 8,
    students: 72,
    rating: 5.0,
    ratingsCount: 2,
    price: 49,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff335f?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "The Complete Guide to Build RESTful APIs...",
    level: "All Levels",
    duration: "20 Hours",
    lessons: 9,
    students: 67,
    rating: 4.0,
    ratingsCount: 2,
    price: 0,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Competitive Strategy Law for Management...",
    level: "All Levels",
    duration: "25 Hours",
    lessons: 7,
    students: 362,
    rating: 3.0,
    ratingsCount: 2,
    price: 75,
    image: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=800&auto=format&fit=crop&q=80",
  },
];

export default function PopularTutors() {
  return (
    <section className="py-10 md:py-24  bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-teal-600 dark:text-teal-400 font-medium">
            Popular Tutors
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Pick A Tutor To Get Started
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-teal-500/70 rounded-full"></div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="overflow-hidden border border-gray-200 dark:border-gray-800 
                         hover:border-teal-500/50 dark:hover:border-teal-500/50 
                         transition-all duration-300 group hover:shadow-xl hover:shadow-teal-500/10"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
                              text-gray-800 dark:text-gray-200 font-medium px-3 py-1"
                  >
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge
                    className="bg-teal-600 text-white px-3 py-1 flex items-center gap-1.5"
                  >
                    <Clock size={14} />
                    {course.duration}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {course.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(course.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1.5">
                    ({course.rating.toFixed(1)} / {course.ratingsCount})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {course.price === 0 ? (
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      Free
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${course.price}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={16} />
                      <span>{course.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={16} />
                      <span>{course.students} Students</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Browse More Button */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg 
                       group transition-all duration-300"
          >
            Browse more courses
            <ChevronRight
              className="ml-2 transition-transform group-hover:translate-x-1"
              size={20}
            />
          </Button>
        </div>
      </div>
    </section>
  );
}