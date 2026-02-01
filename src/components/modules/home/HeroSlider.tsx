"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "Premium Leather Backpack",
    subtitle: "Travel smart. Carry premium.",
    price: "$129.99",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200",
  },
  {
    id: 2,
    title: "Wireless Earbuds Pro",
    subtitle: "Pure sound. Zero wires.",
    price: "$199.99",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200",
  },
  {
    id: 3,
    title: "Minimalist Watch",
    subtitle: "Timeless design for everyday style.",
    price: "$299.99",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200",
  },
  {
    id: 4,
    title: "Designer Sneakers",
    subtitle: "Step into premium comfort.",
    price: "$159.99",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden rounded-b-2xl">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent">
              <div className="h-full max-w-7xl mx-auto px-6 flex items-center">
                <div className="text-white max-w-xl space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200">
                    {slide.subtitle}
                  </p>
                  <p className="text-2xl font-semibold">
                    {slide.price}
                  </p>
                  <Button className="mt-4 bg-white text-black hover:bg-gray-200">
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={() =>
          setCurrent((current - 1 + slides.length) % slides.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() =>
          setCurrent((current + 1) % slides.length)
        }
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 w-3 rounded-full transition ${
              current === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}