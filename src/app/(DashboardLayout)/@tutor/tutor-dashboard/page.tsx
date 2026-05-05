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
import { useTutorByUserId } from "@/hooks/useTutors";
import TutorProfileSkelton from "@/components/modules/tutor/TutorProfileSkeleton";

export default function TutorDashboard() {

  const { data: session, isPending: isSessionLoading } =
     authClient.useSession();
 
   const [open, setOpen] = useState(false); // ← added state for dialog control

   const userId = session?.user?.id;

   const { data: tutorData, isLoading, error: queryError, refetch } = useTutorByUserId(userId);
   const tutor = tutorData as Tutor | null;
   const loading = isLoading || (userId && !tutorData && !queryError);
   const error = queryError ? queryError.message || "Failed to load tutor profile" : null;

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
     refetch();
   };

   return (
      <div className="pb-16 max-w-screen-2xl mx-auto space-y-4">
        {/* Header with Breadcrumbs/Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <DashboardPagesHeader
            title="Tutor Profile Center"
            subtitle="Manage your public profile and track your teaching performance"
            icon={User2}
          />
 
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-black rounded-2xl shadow-xl shadow-[#1cb89e]/20 transition-all active:scale-95 gap-2">
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
 
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left Column: Stats & Profile Info */}
          <div className="lg:col-span-8 space-y-3">
            {/* Main Profile Card */}
            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
               {/* Cover Image/Header */}
               <div className="h-40 bg-gradient-to-br from-[#1cb89e] to-[#128c78] relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
               </div>

               <CardContent className="pt-0 relative px-6 md:px-10 pb-10">
                  <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-15 relative z-10">
                     <div className="relative group">
                        <div className="absolute inset-0 bg-[#1cb89e] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <img
                          src={
                            tutor.poster ??
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.user?.name ?? "Tutor")}&background=random&color=fff&size=200`
                          }
                          alt={tutor.user?.name ?? "Tutor"}
                          className="h-40 w-40 rounded-full object-cover border-[6px] border-background shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
                        />
                     </div>

                     <div className="flex-1 space-y-3 mb-2">
                        <div className="flex flex-wrap items-center gap-3">
                           <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                             {tutor.user?.name ?? "Tutor Name"}
                           </h2>
                           <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                             <Star className="h-4 w-4 fill-amber-500" />
                             <span className="text-sm font-black">{tutor.averageRating?.toFixed(1) ?? "—"}</span>
                           </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                           <p className="text-xl font-bold text-[#1cb89e]">
                             {tutor.title ?? "Full-Stack Tutor"}
                           </p>
                           <span className="text-muted-foreground">•</span>
                           <Badge variant="secondary" className="bg-[#1cb89e]/10 text-[#1cb89e] border-[#1cb89e]/10 rounded-lg px-3">
                             {tutor.categories?.name ?? "Category"}
                           </Badge>
                        </div>
                     </div>

                     <div className="mb-4">
                        {tutor.availability ? (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-black text-xs uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Available Now
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-xs uppercase tracking-widest">
                            Currently Unavailable
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                       <DollarSign className="h-5 w-5 text-[#1cb89e] mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hourly Rate</p>
                       <p className="text-xl font-black">${tutor.rate ?? "?"} <span className="text-xs text-muted-foreground">/ hour</span></p>
                    </div>
                    <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                       <BookOpen className="h-5 w-5 text-[#1cb89e] mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Sessions</p>
                       <p className="text-xl font-black">{tutor.totalBookIng ?? 0} <span className="text-xs text-muted-foreground">Bookings</span></p>
                    </div>
                    <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                       <Clock className="h-5 w-5 text-[#1cb89e] mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preferences</p>
                       <p className="text-xs font-bold truncate">{formatTimeSlots(tutor.timeSlots)}</p>
                    </div>
                  </div>

                  <div className="mt-12 space-y-6">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#1cb89e]" />
                        Professional Bio
                      </h3>
                      <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/30 relative">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg italic font-medium italic">
                          &ldquo;{tutor.bio ?? "No bio provided yet."}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact & Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
                   <CardTitle className="text-xl font-black flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[#1cb89e]" />
                      Contact Details
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                   <div className="flex items-center gap-4 group">
                      <div className="p-3 rounded-2xl bg-[#1cb89e]/10 text-[#1cb89e] group-hover:scale-110 transition-transform">
                         <Mail className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</p>
                         <p className="font-bold truncate">{tutor.user?.email ?? "—"}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 group">
                      <div className="p-3 rounded-2xl bg-[#1cb89e]/10 text-[#1cb89e] group-hover:scale-110 transition-transform">
                         <Phone className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</p>
                         <p className="font-bold">+880 123 456 789</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 group">
                      <div className="p-3 rounded-2xl bg-[#1cb89e]/10 text-[#1cb89e] group-hover:scale-110 transition-transform">
                         <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Base Location</p>
                         <p className="font-bold">Shibganj, Rajshahi</p>
                      </div>
                   </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-muted/50 to-background">
                <CardContent className="p-8">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-[1.5rem] bg-background shadow-xl text-[#1cb89e]">
                           <Award className="h-8 w-8" />
                        </div>
                        <div>
                           <p className="text-xl font-black">Performance</p>
                           <p className="text-sm text-muted-foreground">Certified Mentor</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Member Since</p>
                        <p className="text-lg font-black text-foreground">
                           {new Date(tutor.createdAt).toLocaleDateString("en-US", {
                             month: "long",
                             year: "numeric",
                           })}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Account Status</p>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="font-black text-emerald-500 uppercase tracking-tighter">Verified Provider</span>
                        </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
   );
}