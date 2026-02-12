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
import { getCategories } from "@/actions/category.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addTutor } from "@/actions/tutor.action";
import { redirect, useRouter } from "next/navigation";
import ProfileCard from "@/components/UserProfile/ProfileCard";
import AccountInfoCard from "@/components/UserProfile/AccountInfoCard";
import TutorFormCard from "@/components/UserProfile/TutorFormCard";

type Category = {
  id: number;
  name: string;
  slug: string | null;
};





export default function StudentProfile() {
  const { data: session, isPending, refetch } = authClient.useSession();
    const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<{ message: string } | null>(null);

  //   console.log(categories, error);

  useEffect(() => {
    async function load() {
      const { data, error } = await getCategories();
      setCategories(data.data);
      setError(error);
    }
    load();
  }, []);

  //   console.log(categories);
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-muted/60 p-8">
          <User className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">You're not signed in</h2>
          <p className="text-muted-foreground max-w-md">
            Sign in to view and update your profile, manage your account, and
            access all features.
          </p>
        </div>
        <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
          <a href="/sign-in">Sign In</a>
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

  // First letter for avatar fallback
  const userInitial =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "?";

  const phoneNumber = "Not available"; // ← replace with real phone logic later

  const handlePassChange = () => {
    toast.success("Feature coming soon!");
  };

  return (
    <div className="px-0 lg:px-5 pb-12 max-w-screen-2xl">
      <DashboardPagesHeader
        title="Update Profile"
        subtitle="Update Your Information to become a Tutor"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 gap-8">
        {/* Left Column */}
       {/* Left sidebar */}
        <div className="lg:col-span-2 xl:col-span-1 space-y-6">
          <ProfileCard user={session.user} />
          <AccountInfoCard user={session.user} createdAt={session.user.createdAt} />
        </div>

        <div className="lg:col-span-3 xl:col-span-3  space-y-6 ">
           <TutorFormCard user={session.user} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}
