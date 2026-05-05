'use client';

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import Autoplay from "embla-carousel-autoplay";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SectionHeader from "@/components/shared/SectionHeader";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  tutor: {
    title: string;
    poster: string | null;
  };
  user: {
    name: string;
    image: string | null;
  };
}

interface ReviewsClientProps {
  reviews: Review[];
}

export default function ReviewsClient({ reviews }: ReviewsClientProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-11/12 mx-auto mb-10 text-center py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Student Reviews
        </h2>
        <p className="text-lg text-gray-600">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <Carousel
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full mx-auto"
    >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="md:basis-1/2 lg:basis-1/3 pl-3"
              >
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col">
                  <div className="flex justify-start mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 bg-[#1cb89e]/10 rounded-full flex items-center justify-center">
                        <FaQuoteLeft className="text-[#1cb89e] text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? "text-[#1cb89e]" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-100 text-base leading-relaxed mb-8 line-clamp-4 flex-grow">
                    {review.comment || "No comment provided."}
                  </p>

                  <div className="flex items-center justify-between border-t pt-6 mt-auto">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={review.user?.image || undefined}
                          alt={review.user?.name || "Student"}
                        />
                        <AvatarFallback className="bg-[#1cb89e]/10 text-[#1cb89e]">
                          {review.user?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {review.user?.name || "Anonymous Student"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-50">
                          {moment(review.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-100">for</p>
                      <p className="text-sm font-medium text-[#1cb89e] line-clamp-1 max-w-[140px]">
                        {review.tutor?.title || "Tutor"}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}
