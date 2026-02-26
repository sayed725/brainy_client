import BecomeTutorSection from "@/components/modules/home/BecomeTutorSection";
import FAQSection from "@/components/modules/home/FAQSection";
import Hero from "@/components/modules/home/Hero";
import PopularTutors from "@/components/modules/home/PopularTutors";
import Reviews from "@/components/modules/home/Reviews";
import StatsSection from "@/components/modules/home/StatsSection";
import { reviewServices } from "@/services/review.service";



export default async function Home() {

    const reviewsResponse = await reviewServices.getAllReviews();
    const reviews = reviewsResponse?.data?.data || [];







  return (
    <div className="">
    {/* <HeroSlider/> */}
    <Hero/>
    <StatsSection/>
    <PopularTutors/>
    <BecomeTutorSection/>
    <Reviews reviews={reviews}/>
    <FAQSection />
    </div>
  );
}
