// components/StatsSection.tsx
"use client";

import {
  PiLaptopBold, // subjects / courses
  PiChalkboardTeacherBold, // tutors
  PiCertificateBold, // certifications
  PiUsersThreeBold, // students
} from "react-icons/pi";
import CountUp from "react-countup";

const STATS = [
  {
    icon: PiLaptopBold,
    value: "3020",
    label: "Subjects Covered",
  },
  {
    icon: PiChalkboardTeacherBold,
    value: "300",
    label: "Tutors",
  },
  {
    icon: PiCertificateBold,
    value: "400",
    label: "Certifications",
  },
  {
    icon: PiUsersThreeBold,
    value: "5000",
    label: "Students",
  },
];

export default function StatsSection() {
  return (
    <div className="  bg-linear-to-r from-teal-700 to-teal-950
        dark:from-gray-950 dark:to-gray-900
        text-white dark:text-gray-100  py-10 md:py-10">
      <div
      className="
      
        container mx-auto px-6 lg:px-0
        grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4
        place-items-center  
      "
      // ref={ref}
    >
      {STATS.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-4 w-fit min-w-55"
        >
          <stat.icon size={64} className="text-teal-300 shrink-0" />

          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {isNaN(Number(stat.value)) ? (
                stat.value
              ) : (
                <CountUp
                  delay={0}
                  start={10}
                  end={Number(stat.value)}
                  duration={2.5}
                  separator=","
                />
              )}
            </h1>
            <h3 className="text-lg md:text-xl font-semibold text-teal-100">
              {stat.label}
            </h3>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
