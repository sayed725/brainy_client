import { tutorServices } from "@/services/tutor.service";

import { Clock, BookOpen, Users, Star, ChevronRight } from "lucide-react";
import { IoIosTime } from "react-icons/io";
import { CiTimer } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaTimes } from "react-icons/fa";


export default async function Tutors() {


    const { data } = await tutorServices.getAllTutors()

    // console.log(data)






    return (
       <section className="py-10  bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-teal-600 dark:text-teal-400 font-medium">
            All Tutors
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
          {data?.data?.map((tutor:any, index:number) => (
            <Card
              key={index}
              className="overflow-hidden border border-gray-200 dark:border-gray-800 
                         hover:border-teal-500/50 dark:hover:border-teal-500/50 
                         transition-all duration-300 group hover:shadow-xl hover:shadow-teal-500/10 pt-0"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tutor?.poster}
                  alt={"tutor_poster"}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
                              text-gray-800 dark:text-gray-200 font-medium px-3 py-1"
                  >
                    {tutor?.category?.name}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge
                    className="bg-teal-600 text-white px-3 py-1 flex items-center gap-1.5"
                  >
                    <Users size={16} />
                      <span>{tutor.totalBookIng} Students</span>
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="">
                <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {tutor?.bio}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(tutor.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1.5">
                  ({tutor?.averageRating} / {5})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {tutor?.rate === 0 ? (
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      Free
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${tutor?.rate}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center flex-wrap gap-4">
                   {
                    tutor.timeSlots.map((timeSlot:any, index:number) => (
                       <div key={index} className="flex items-center gap-1.5">
                      <IoIosTime size={16} className="text-[#1cb89e]" />
                      <span>{timeSlot}</span>
                    </div>
                    ))
                   }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    );
}