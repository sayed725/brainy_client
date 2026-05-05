"use client";

import { useEffect } from "react";
import ContactSection from "@/components/modules/home/ContactSection";
import LocationSection from "@/components/modules/contact/LocationSection";

export default function Contact() {
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      {/* Reusing the home ContactSection for brand consistency */}
      <ContactSection />
      
      {/* Location / Map Section */}
      <div className="container w-11/12 mx-auto pb-16">
        <LocationSection />
      </div>
    </div>
  );
}