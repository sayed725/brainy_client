import BecomeTutorSection from "@/components/modules/home/BecomeTutorSection";
import Hero from "@/components/modules/home/Hero";
import PopularTutors from "@/components/modules/home/PopularTutors";
import StatsSection from "@/components/modules/home/StatsSection";



export default async function Home() {







  return (
    <div className="">
    {/* <HeroSlider/> */}
    <Hero/>
    <StatsSection/>
    <PopularTutors/>
    <BecomeTutorSection/>
    </div>
  );
}
