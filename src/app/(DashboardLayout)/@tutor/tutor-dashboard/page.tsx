"use client"

import { Tutor } from "@/constants/otherinterface";

import moment from "moment";
import {
  Star,
  Edit2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  BookOpen,
  Clock,
  Award,
  User,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import StatCard from "@/components/modules/tutor/StatCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditTutorModalContent from "@/components/modules/tutor/EditTutorModalContent";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getTutorByUserId } from "@/actions/tutor.action";
import TutorProfileSkelton from "@/components/modules/tutor/TutorProfileSkeleton";

export default function TutorDashboard() {

  const { data: session, isPending: isSessionLoading } =
     authClient.useSession();
 
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [tutor, setTutor] = useState<Tutor | null>(null);
   const [open, setOpen] = useState(false); // ← added state for dialog control

   const userId = session?.user?.id;

   const refreshTutor = async () => {
     if (!userId) return;

     setLoading(true);
     setError(null);

     try {
       const result = await getTutorByUserId(userId);

       if (result.error) {
         throw new Error(result.error.message || "Failed to load tutor profile");
       }

       setTutor(result.data.data ?? null);
     } catch (err: any) {
       const message = err.message || "Failed to load tutor information";
       setError(message);
       console.error("Error loading tutor:", err);
     } finally {
       setLoading(false);
     }
   };

   useEffect(() => {
     if (userId) {
       refreshTutor();
     } else {
       setLoading(false);
       setTutor(null);
     }
   }, [userId]);

  //  console.log("TutorDashboard State:", { userId, tutor, loading, error, open });

   if (isSessionLoading || loading) {
     return <TutorProfileSkelton />;
   }

   if (error) {
     return (
       <div className="flex items-center justify-center h-64">
         <span className="text-red-500">{error}</span>
       </div>
     );
   }

   if (!tutor) {
     return (
       <div className="flex items-center justify-center h-64">
         <span className="text-muted-foreground">No tutor profile found. Please create one.</span>
       </div>
     );
   }

   const formatTimeSlots = (slots: string[] | undefined) => {
     if (!slots || slots.length === 0) return "Not specified";
     return slots
       .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
       .join(", ");
   };

   const handleSuccess = () => {
     setOpen(false);
     // refresh data after update
     refreshTutor();
     // or window.location.reload() if you prefer full refresh
   };

   return (
     <div className="px-0 lg:px-6 pb-16">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <DashboardPagesHeader
           title={"My Tutor Profile"}
           subtitle={"Manage and showcase your teaching profile"}
           icon={User2}
         />

         {/* Controlled Dialog */}
         <Dialog open={open} onOpenChange={setOpen}>
           <DialogTrigger asChild>
             <Button variant="outline" className="gap-2">
               <Edit2 className="h-4 w-4" />
               Edit Profile
             </Button>
           </DialogTrigger>

           <EditTutorModalContent
             tutor={tutor}
             close={() => setOpen(false)}
             onSuccess={handleSuccess}
           />
         </Dialog>
       </div>

       {/* Main Profile Card */}
       <Card className="border shadow-sm">
         <CardHeader className="pb-6">
           <div className="flex flex-col md:flex-row md:items-start gap-6">
             <div className="shrink-0">
               <img
                 src={
                   tutor.poster ??
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.user?.name ?? "Tutor")}&background=random&color=fff&size=160`
                 }
                 alt={tutor.user?.name ?? "Tutor"}
                 className="h-32 w-32 rounded-full object-cover border-4 border-primary/30 shadow-md"
               />
             </div>

             <div className="flex-1 space-y-4">
               <div>
                 <h2 className="text-2xl md:text-3xl font-bold">
                   {tutor.user?.name ?? "Tutor Name"}
                 </h2>
                 <p className="text-xl text-primary font-medium mt-1">
                   {tutor.title ?? "Full-Stack Tutor"}
                 </p>
               </div>

               <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-1.5">
                   <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                   <span className="font-semibold text-lg">
                     {tutor.averageRating?.toFixed(1) ?? "—"}
                   </span>
                   <span className="text-muted-foreground text-sm">
                     ({tutor.totalBookIng ?? 0} reviews)
                   </span>
                 </div>

                 <Badge variant="secondary" className="text-base px-4 py-1">
                   {tutor.categories?.name ?? "Category"}
                 </Badge>

                 {tutor.availability ? (
                   <Badge
                     variant="outline"
                     className="bg-green-50 text-green-700 border-green-200"
                   >
                     Available Now
                   </Badge>
                 ):
                  <Badge
                     variant="outline"
                     className="bg-red-50 text-black border-red-200"
                   >
                     Un Available
                   </Badge>
                 }
               </div>

               <div className="flex flex-wrap gap-6 text-sm">
                 <div className="flex items-center gap-2">
                   <DollarSign className="h-4 w-4 text-primary" />
                   <span className="font-medium">
                     ${tutor.rate ?? "?"} / hour
                   </span>
                 </div>
                 <div className="flex items-center gap-2">
                   <BookOpen className="h-4 w-4 text-primary" />
                   <span>{tutor.totalBookIng ?? 0} bookings</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock className="h-4 w-4 text-primary" />
                   <span>{formatTimeSlots(tutor.timeSlots)} preferred</span>
                 </div>
               </div>
             </div>
           </div>
         </CardHeader>

         <CardContent className="space-y-10 pt-2">
           <div>
             <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
               <User className="h-5 w-5" />
               About Me
             </h3>
             <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
               {tutor.bio ?? "No bio provided yet."}
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex items-start gap-4">
               <Mail className="h-5 w-5 text-[#1cb89e] mt-0.5" />
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wide">
                   Email
                 </p>
                 <p className="font-medium">{tutor.user?.email ?? "—"}</p>
               </div>
             </div>

             <div className="flex items-start gap-4">
               <Phone className="h-5 w-5 text-[#1cb89e] mt-0.5" />
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wide">
                   Phone
                 </p>
                 <p className="font-medium">+880 123 456 789</p>
               </div>
             </div>

             <div className="flex items-start gap-4">
               <MapPin className="h-5 w-5 text-[#1cb89e] mt-0.5" />
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wide">
                   Location
                 </p>
                 <p className="font-medium">Shibganj, Rajshahi</p>
               </div>
             </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <StatCard
               icon={<DollarSign className="h-5 w-5 text-[#1cb89e]" />}
               value={`$${tutor.rate ?? "?"}`}
               label="Hourly Rate"
             />
             <StatCard
               icon={<BookOpen className="h-5 w-5 text-[#1cb89e]" />}
               value={tutor.totalBookIng ?? 0}
               label="Total Bookings"
             />
             <StatCard
               icon={<Star className="h-5 w-5 text-[#1cb89e]" />}
               value={tutor.averageRating?.toFixed(1) ?? "—"}
               label="Average Rating"
             />
             <StatCard
               icon={<Calendar className="h-5 w-5 text-[#1cb89e]" />}
               value="—"
               label="This Month Hours"
             />
           </div>

           <div className="text-sm text-muted-foreground border-t pt-6">
             <p>
               Tutor since{" "}
               {new Date(tutor.createdAt).toLocaleDateString("en-US", {
                 month: "long",
                 year: "numeric",
               })}
             </p>
             <p className="mt-1">
               Last updated {tutor.updatedAt && moment(tutor.updatedAt).fromNow()}
             </p>
           </div>
         </CardContent>
       </Card>
     </div>
   );
}