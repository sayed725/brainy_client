import SectionHeader from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Clock, MapPin, ShoppingBag } from "lucide-react";
import { FaLocationDot } from "react-icons/fa6";





export default function LocationSection() {
  return (
    <div>
      {/* Section Heading */}
     
        <div className="text-center mb-10 flex flex-col items-center">
          <SectionHeader
            badge="Our Location"
            title="You Can Visit Us Anytime"
          />
        </div>
      
      {/* Main Section */}
      <Tabs defaultValue="map" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-4 border">
          <TabsTrigger
            className={"cursor-pointer  w-full "}
            value="map"
          >
            Map View
          </TabsTrigger>
          <TabsTrigger
            className={"cursor-pointer w-full "}
            value="directions"
          >
            Directions & Nearby
          </TabsTrigger>
        </TabsList>
        {/* Tab Map Content */}
        <TabsContent value="map">
          <div className="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.272951834244!2d90.3725516!3d23.7449573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b29f795777%3A0x6b539487c6999147!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1714900000000!5m2!1sen!2sbd"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-90 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl"
            />
          </div>
        </TabsContent>
        {/* Direction Tab Content */}
        <TabsContent value="directions">
          <Card
            className={
              "border shadow-xl border-slate-200 dark:border-slate-800 w-full py-6 rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
            }
          >
            <CardContent className="flex gap-y-6 gap-x-10 xl:gap-x-16 flex-col lg:flex-row lg:items-stretch">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-500/10 p-3 rounded-xl">
                    <MapPin className="h-5 w-5 text-[#1cb89e]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Our Main Office</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      Nawabjong, Dhaka 1320, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mt-8">
                  <div className="bg-teal-500/10 p-3 rounded-xl">
                    <Clock className="h-5 w-5 text-[#1cb89e]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Operating Hours</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      Sunday — Thursday: 9:00 AM - 8:00 PM
                    </p>
                    <p className="text-[#1cb89e] text-xs font-bold mt-2 uppercase tracking-wider">
                      Available for online support 24/7
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-8 items-start lg:border-l border-slate-100 dark:border-slate-800 lg:pl-12">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                    Nearby Landmarks
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                        <Building className="h-4 w-4 text-[#1cb89e]" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">National Museum - 10 min drive</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                        <ShoppingBag className="h-4 w-4 text-[#1cb89e]" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Dhanmondi Lake - 5 min walk</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}