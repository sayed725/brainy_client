import BecomeTutorSection from "@/components/modules/home/BecomeTutorSection";
import Hero from "@/components/modules/home/Hero";
import StatsSection from "@/components/modules/home/StatsSection";



export default function Home() {
  return (
    <div className="">
    {/* <HeroSlider/> */}
    <Hero/>
    <StatsSection/>
    <BecomeTutorSection/>
    </div>
  );
}
