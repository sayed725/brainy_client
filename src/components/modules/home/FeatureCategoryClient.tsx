"use client";

import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { motion, Variants } from 'framer-motion'
import SectionHeader from '@/components/shared/SectionHeader';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
};

export const FeatureCategorySkeleton = () => {
  return (
    <div className="flex gap-3 overflow-hidden -ml-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="shrink-0 ml-3 basis-[48%] sm:basis-1/2 md:basis-[30%] lg:basis-1/5 h-36 sm:h-42 bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-2xl" 
        />
      ))}
    </div>
  )
}

const FeatureCategoryClient = ({ categories, isLoading }: { categories: any[], isLoading?: boolean }) => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className='bg-gray-100 dark:bg-gray-950 overflow-hidden'>
      <section className="py-10 container mx-auto px-4 lg:px-0">
        <div className="flex flex-row justify-between items-end mb-10 gap-4">
          <div className="flex-1">
            <SectionHeader
              title="Browse Categories"
              badge="Expertise"
              description="Find the perfect mentor in your preferred field of study."
              descriptionClassName="hidden lg:block"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 mb-1">
            {/* Custom Navigation */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-800 hover:border-[#1cb89e] hover:text-[#1cb89e] transition-all"
                onClick={() => api?.scrollPrev()}
                disabled={isLoading}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-200 dark:border-gray-800 hover:border-[#1cb89e] hover:text-[#1cb89e] transition-all"
                onClick={() => api?.scrollNext()}
                disabled={isLoading}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <Button asChild className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white rounded-xl shadow-lg shadow-[#1cb89e]/20 transition-all duration-300 font-bold px-5">
              <Link href="/tutors" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <FeatureCategorySkeleton />
        ) : (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
            >
              <CarouselContent className="-ml-3">
                {categories.map((cat) => (
                  <CarouselItem key={cat.id} className="pl-3 basis-[48%] sm:basis-1/2 md:basis-[30%] lg:basis-1/5">
                    <motion.div variants={itemVariants} className="h-full">
                      <Link
                        href={`/tutors?categoryName=${cat.name}`}
                        className="block group relative overflow-hidden rounded-2xl h-36 sm:h-42 bg-card border border-gray-100 dark:border-gray-800 hover:border-[#1cb89e]/30 hover:shadow-xl hover:shadow-[#1cb89e]/5 transition-all duration-500"
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={cat.name}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1cb89e]/5 to-transparent flex items-center justify-center">
                            <span className="text-[#1cb89e]/20 font-bold text-4xl">{cat.name.charAt(0)}</span>
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300">
                          <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-[#1cb89e] transition-colors">
                            {cat.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-[#1cb89e] rounded-full transition-all duration-300 group-hover:w-10" />
                            <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest">
                              Explore
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </motion.div>
          </Carousel>
        )}
      </section>
    </div>
  )
}

export default FeatureCategoryClient;
