// components/StatsSection.tsx
"use client";

import { 
  PiLaptopBold,          // subjects / courses
  PiChalkboardTeacherBold, // tutors
  PiCertificateBold,     // certifications
  PiUsersThreeBold       // students
} from "react-icons/pi";

const STATS = [
  {
    icon: PiLaptopBold,
    value: "3020",
    label: "Subjects Covered",
  },
  {
    icon: PiChalkboardTeacherBold,
    value: "Top",
    label: "Tutors",
  },
  {
    icon: PiCertificateBold,
    value: "Online",
    label: "Certifications",
  },
  {
    icon: PiUsersThreeBold,
    value: "6000",
    label: "Students",
  },
];


export default function StatsSection() {
  return (
    <div 
    
      className="
        bg-gradient-to-r from-teal-700 to-teal-950 
        dark:from-gray-950 dark:to-gray-900
        text-white dark:text-gray-100
      "
    >
      <div 
        className="
          container mx-auto 
          py-6
        "
      >
        <div 
          className="
            flex flex-col lg:flex-row 
            items-center lg:items-start 
            justify-center lg:justify-between 
            gap-10 md:gap-12 lg:gap-16 xl:gap-20
          "
        >
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="
                flex items-center gap-5 md:gap-6 
                w-full max-w-xs lg:max-w-none
                text-left
              "
            >
              <div
                className="
                  flex-shrink-0 w-20 h-20 
                  sm:w-24 sm:h-24 
                  rounded-full 
                  bg-white/15 backdrop-blur-sm 
                  flex items-center justify-center 
                  border border-white/20 
                  shadow-lg shadow-black/10
                "
              >
                <stat.icon 
                  className="
                    w-10 h-10 sm:w-12 sm:h-12 
                    text-white dark:text-teal-300
                  " 
                />
              </div>

              <div>
                <div 
                  className="
                    text-3xl sm:text-4xl md:text-5xl 
                    font-bold tracking-tight
                  "
                >
                  {stat.value}
                </div>
                <div 
                  className="
                    text-base sm:text-lg md:text-xl 
                    font-medium mt-1 opacity-90
                  "
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}