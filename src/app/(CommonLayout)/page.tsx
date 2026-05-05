import BecomeTutorSection from "@/components/modules/home/BecomeTutorSection";
import ContactSection from "@/components/modules/home/ContactSection";
import FAQSection from "@/components/modules/home/FAQSection";
import Hero from "@/components/modules/home/Hero";
import FeatureCategory from "@/components/modules/home/FeatureCategory";
import HowItWorksSection from "@/components/modules/home/HowItWorksSection";
import LatestBlogsSection from "@/components/modules/home/LatestBlogsSection";
import PopularTutors from "@/components/modules/home/PopularTutors";
import Reviews from "@/components/modules/home/Reviews";
import StatsSection from "@/components/modules/home/StatsSection";



export default async function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-950">
    {/* 1. Hero */}
    <Hero/>
    {/* 2. Statistics */}
    <StatsSection/>
    {/* 3. Categories */}
    <FeatureCategory />
    {/* 4. Popular Tutors */}
    <PopularTutors/>
    {/* 5. How It Works */}
    <HowItWorksSection />
    {/* 6. Call to Action – Become a Tutor */}
    <BecomeTutorSection/>
    {/* 7. Testimonials / Reviews */}
    <Reviews />
    {/* 8. Latest Blog Posts */}
    <LatestBlogsSection />
    {/* 9. FAQ */}
    <FAQSection />
    {/* 10. Contact Form */}
    <ContactSection />
    </div>
  );
}
