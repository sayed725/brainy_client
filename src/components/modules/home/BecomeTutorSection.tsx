// components/BecomeTutorSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt, 
  FaArrowRight 
} from "react-icons/fa";

const THEME_COLOR = "#1cb89e";


export default function BecomeTutorSection() {
  return (
    <section className=" py-10 md:py-24  bg-gray-100 dark:bg-gray-950 overflow-hidden"> 
        <div className="relative mx-auto lg:w-11/12 max-w-screen-2xl">
      {/* Subtle background pattern - visible in both modes */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, ${THEME_COLOR} 1px, transparent 1px),
                             radial-gradient(circle at 90% 80%, ${THEME_COLOR} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-6 lg:px-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Image */}
          <div className="relative w-full h-80 md:h-96 lg:h-125 rounded-xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/tutor.jpg"
                alt="Confident tutor smiling"
                className="absolute inset-0  h-auto object-cover w-full"
                width={100}
                height={100}
              />
             
           

            {/* Small floating badge on image */}
            <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-[#1cb89e]/20 dark:border-[#1cb89e]/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#1cb89e]/10 dark:bg-[#1cb89e]/20 flex items-center justify-center">
                  <FaUsers className="text-[#1cb89e] text-xl" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Join 200+ tutors
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-2 lg:space-y-4 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1cb89e]/10 dark:bg-[#1cb89e]/20 text-[#1cb89e] font-medium text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1cb89e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1cb89e]"></span>
              </span>
              Start Earning Today
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Become a <span style={{ color: THEME_COLOR }}>tutor</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Earn money by sharing your expert knowledge with students. 
              Sign up today and start tutoring online with Brainy — get paid securely and grow your teaching business.
            </p>

            <ul className="space-y-2 lg:space-y-3 text-gray-700 dark:text-gray-300">
              {[
                { icon: FaUsers, text: "Find new students every week" },
                { icon: FaChartLine, text: "Grow your tutoring business" },
                { icon: FaShieldAlt, text: "Get paid securely & on time" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="shrink-0 h-10 w-10 rounded-full bg-[#1cb89e]/10 dark:bg-[#1cb89e]/20 flex items-center justify-center">
                    <item.icon className="text-[#1cb89e] text-xl" />
                  </div>
                  <span className="text-base md:text-lg">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 lg:pt-4">
              <Button
                className="
                  inline-flex items-center gap-3 px-8 py-4 
                  bg-[#1cb89e] hover:bg-[#148f7c] 
                  text-white font-medium text-xl rounded-xl 
                  transition-all duration-300 shadow-lg hover:shadow-xl
                  dark:shadow-[#1cb89e]/20 dark:hover:shadow-[#1cb89e]/30
                "
              >
                Become a Tutor
                <FaArrowRight className="text-xl" />
              </Button>
            </div>

            <div className="pt-2 lg:pt-2">
              <a 
                href="#how-it-works" 
                className="text-[#1cb89e] hover:text-[#148f7c] font-medium underline-offset-4 hover:underline transition-colors"
              >
                How our platform works →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}