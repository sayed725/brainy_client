// components/HowItWorksSection.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { Search, CalendarCheck, GraduationCap } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const STEPS = [
  {
    icon: Search,
    number: "01",
    title: "Browse & Search",
    description:
      "Explore our curated list of expert tutors. Filter by subject, rating, availability, and price to find the perfect match for your learning goals.",
  },
  {
    icon: CalendarCheck,
    number: "02",
    title: "Book a Session",
    description:
      "Pick a convenient time slot that fits your schedule. Confirm your booking instantly and get ready for a personalized learning experience.",
  },
  {
    icon: GraduationCap,
    number: "03",
    title: "Start Learning",
    description:
      "Join your live 1-on-1 session with your tutor. Learn at your own pace, ask questions freely, and achieve your academic goals.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HowItWorksSection() {
  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #1cb89e 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-0 relative">
        {/* Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          <SectionHeader
            title="Get Started in 3 Simple Steps"
            badge="How It Works"
            description="From finding the right tutor to acing your goals — it's as easy as 1-2-3."
            descriptionClassName="hidden lg:block"
          />
        </div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-[#1cb89e]/20" />

          {STEPS.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative flex flex-col mb-10 items-center text-center group"
            >
              {/* Icon Container */}
              <div className="relative mb-6">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-[#1cb89e]/10 scale-125 group-hover:scale-150 group-hover:bg-[#1cb89e]/15 transition-all duration-500" />

                {/* Number badge */}
                <div className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-[#1cb89e] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-[#1cb89e]/30">
                  {step.number}
                </div>

                {/* Icon circle */}
                <div className="relative z-[1] w-20 h-20 rounded-full bg-white dark:bg-gray-800 border-2 border-[#1cb89e]/20 flex items-center justify-center shadow-lg group-hover:border-[#1cb89e]/40 transition-all duration-300">
                  <step.icon className="w-9 h-9 text-[#1cb89e]" strokeWidth={1.5} />
                </div>
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#1cb89e] transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
