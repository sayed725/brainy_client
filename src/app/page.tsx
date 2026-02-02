import BecomeTutorSection from "@/components/modules/home/BecomeTutorSection";
import Hero from "@/components/modules/home/Hero";
import StatsSection from "@/components/modules/home/StatsSection";
import { authClient } from "@/lib/auth-client";



export default async function Home() {


  const session = await authClient.getSession();

  console.log("Session in home page", session);




  return (
    <div className="">
    {/* <HeroSlider/> */}
    <Hero/>
    <StatsSection/>
    <BecomeTutorSection/>
    </div>
  );
}
