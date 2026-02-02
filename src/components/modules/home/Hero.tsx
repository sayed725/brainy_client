// components/Hero.tsx
"use client";

import HeroSearch from "./HeroSearch";

const THEME_COLOR = "#1cb89e";

export default function Hero() {
  return (
    <div className="relative w-full lg:mt-10 overflow-visible bg-gradient-to-r from-teal-700 to-teal-950 dark:from-gray-950 dark:to-gray-900">
      {/* Background wave pattern – lowered opacity for dark comfort */}
      <div className="absolute inset-0 opacity-10 dark:opacity-4 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,50 Q20,45 40,50 T80,50 T100,50 V100 H0 V50"
            fill="white"
            className="dark:fill-gray-300/70"
          />
          <path
            d="M0,60 Q25,65 50,60 T100,60 V100 H0 V60"
            fill="white"
            className="dark:fill-gray-400/60"
          />
          <path
            d="M0,70 Q30,75 60,70 T100,70 V100 H0 V70"
            fill="white"
            className="dark:fill-gray-500/50"
          />
        </svg>
      </div>

      {/* Bottom zigzag line – reduced opacity in dark mode */}
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20 dark:opacity-6 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,30 L30,30 L45,10 L60,50 L75,10 L90,50 L105,10 L120,50 L135,30 L300,30 L315,10 L330,50 L345,10 L360,50 L375,10 L390,50 L405,30 L600,30 L615,10 L630,50 L645,10 L660,50 L675,10 L690,50 L705,30 L900,30 L915,10 L930,50 L945,10 L960,50 L975,10 L990,50 L1005,30 L1200,30"
            fill="none"
            stroke="white"
            className="dark:stroke-gray-500"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Main content – spacing unchanged */}
      <div className="relative mx-auto w-11/12 max-w-screen-2xl py-16 lg:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Left – Text + Stats + Search */}
          <div className="lg:w-1/2 space-y-2 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 dark:bg-gray-800/40 backdrop-blur-sm text-white dark:text-gray-200 text-sm font-medium border border-white/10 dark:border-gray-700/60 tracking-wider">
            <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1cb89e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1cb89e]"></span>
              </span>
              Trusted by <span className="text-[#1cb89e] mx-1">5,000+</span>Students & Parents
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-gray-50 tracking-tight leading-tight">
              Unlock Your Potential
              <span className="block">With <span className="text-[#1cb89e]">Brainy Tutors</span></span>
            </h1>

            <p className="text-lg lg:text-xl text-white/90 dark:text-gray-300 max-w-2xl font-medium">
              Connect with expert tutors for personalized 1-on-1 online lessons.
              From school subjects to exam preparation and skill-building —
              learn at your own pace, anytime, anywhere.
            </p>

            {/* Stats – same grid & padding */}
            <div className="grid grid-cols-3 gap-6 mt-5">
              {[
                { value: "4.9★", label: "Average Rating" },
                { value: "24/7", label: "Flexible Scheduling" },
                { value: "50+", label: "Subjects Covered" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/10 dark:border-gray-700/50"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-white dark:text-teal-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/80 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Search component – spacing unchanged */}
            <div className="mt-10 max-w-xl">
              <HeroSearch />
            </div>
          </div>

          {/* Right – Image + Badges */}
          <div className="lg:w-1/2 relative animate-fade-in pt-10 lg:py-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 dark:shadow-black/60 border border-white/10 dark:border-gray-700">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2070"
                alt="Happy student learning online with a dedicated tutor"
                className="w-full h-auto object-cover brightness-[0.97] dark:brightness-90"
                loading="eager"
                fetchPriority="high"
              />

              {/* Floating badge bottom-right – same positioning & padding */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-teal-100/20 p-2 sm:p-4 rounded-lg shadow-md backdrop-blur-md border border-white/30">
                <div className="border-2 rounded-lg border-white/40 p-2 sm:p-4 bg-white/10 backdrop-blur-sm text-white">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold ">
                    200+
                  </p>
                  <p className="font-medium text-sm">
                    Expert Tutors 
                  </p>
                </div>
              </div>

              {/* Bottom right section */}
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-teal-100/20 p-2 sm:p-4 rounded-lg shadow-md backdrop-blur-md border border-white/30">
                <div className="border-2 rounded-lg border-white/40 p-2 sm:p-4 bg-white/10 backdrop-blur-sm text-white">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    5+
                  </p>
                  <p className="font-medium text-sm">
                    Years Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
