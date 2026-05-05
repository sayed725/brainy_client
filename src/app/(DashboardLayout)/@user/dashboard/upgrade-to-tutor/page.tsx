"use client";

import { useEffect, useState } from "react";
import { format, isValid } from "date-fns";
import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  IdCard,
  Lock,
  Mail,
  Phone,
  Shield,
  Upload,
  User,
} from "lucide-react";

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { redirect, useRouter } from "next/navigation";
import ProfileCard from "@/components/UserProfile/ProfileCard";
import AccountInfoCard from "@/components/UserProfile/AccountInfoCard";
import TutorFormCard from "@/components/UserProfile/TutorFormCard";
import UserProfileSkelton from "@/components/modules/user/UserProfileSkelton";

type Category = {
  id: number;
  name: string;
  slug: string | null;
};





export default function StudentProfile() {
  const { data: session, isPending, refetch } = authClient.useSession();
    const router = useRouter();


  const timeSlots = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"] as const;

  const user = session?.user;

  // TanStack Form Setup
  // ────────────────────────────────────────────────
//   const form = useForm({
//     defaultValues: {
//       title: "",
//       bio: "",
//       timeSlots: "",
//       rate: 0,
//       poster: "",
//       categoryId: "",
//     },
//     // validators: {
//     //   onSubmit: formSchema,
//     // },
//  onSubmit: async ({ value }) => {
//   console.log("Raw form values:", value);

//   const toastId = toast.loading("Updating tutor profile...");

//   try {
//     const selectedCategory = categories.find(
//       (cat) => cat.name === value.categoryId
//     );

//     const tutorData = {
//       title: value.title.trim(),
//       bio: value.bio.trim(),
//       poster: value.poster.trim(),
//       rate: Number(value.rate) || 0,
//       categoryId: selectedCategory?.id ?? null,
//       timeSlots: value.timeSlots ? [value.timeSlots.trim().toUpperCase()] : [],
//       userId: user?.id ?? null,
//     };

//     console.log("Sending to API:", tutorData);

//     const res = await addTutor(tutorData);

//     if (res.error) {
//       toast.error(res.error.message || "Failed to create tutor profile", { id: toastId });
//       return;
//     }

//     toast.success("Tutor profile created successfully!", { id: toastId });
//     refetch();
//     router.push("/");

//   } catch (err: any) {
//     console.error("[submit error]", err);
//     toast.error(err.message || "Something went wrong", { id: toastId });
//   }
// },
//   });

  if (isPending) {
    return (
      <UserProfileSkelton/>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <div className="absolute -inset-4 bg-[#1cb89e]/20 blur-3xl rounded-full opacity-50" />
          <div className="relative rounded-3xl bg-card border border-border/50 p-8 shadow-2xl">
            <User className="h-16 w-16 text-[#1cb89e]" />
          </div>
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-3xl font-black tracking-tight">Access Denied</h2>
          <p className="text-muted-foreground leading-relaxed">
            Please sign in to your account to update your profile and begin your journey as a mentor on our platform.
          </p>
        </div>
        <Button asChild size="lg" className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold h-12 px-10 rounded-2xl shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95">
          <a href="/login">Sign In Now</a>
        </Button>
      </div>
    );
  }

  // Safe date formatting helper
  const formatSafe = (dateValue?: string | number | Date) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    return isValid(date) ? format(date, "d MMMM yyyy") : "—";
  };

  return (
    <div className="pb-16 max-w-screen-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <DashboardPagesHeader
        title="Mentor Application"
        subtitle="Complete your profile details to start sharing your knowledge with students"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">
            <ProfileCard user={session.user} />
            <AccountInfoCard user={session.user} createdAt={session.user.createdAt} />
          </div>
        </div>

        {/* Right Column - Application Form */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
           <TutorFormCard user={session.user} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}
