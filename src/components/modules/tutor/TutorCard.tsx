"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Star, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Helper: Get initials from name
function getInitials(name: string | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper: Truncate text with ellipsis
function truncate(text: string | undefined | null, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function TutorCard({ tutor, index }: { tutor: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        y: -5,
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="h-full"
    >
      <Card
        key={tutor.id || index}
        className="group h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 
                   hover:border-[#1cb89e]/40 dark:hover:border-[#1cb89e]/40 
                   transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-[#1cb89e]/20 py-0"
      >
        {/* Header Image Area */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {tutor.poster ? (
            <img
              src={tutor.poster}
              alt={`${tutor.title} poster`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1cb89e]/10 to-transparent flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#1cb89e]/20" />
            </div>
          )}

          {/* Category Badge */}
          {tutor.categories && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-white/90 dark:bg-black/60 backdrop-blur-md border-none text-[#1cb89e] dark:text-teal-400 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                {tutor.categories.name}
              </Badge>
            </div>
          )}

          {/* Availability Dot */}
          <div className="absolute top-3 right-3 z-10">
            <div className={`px-2 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${tutor.availability
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${tutor.availability ? "bg-emerald-500 animate-pulse" : "bg-gray-500"}`} />
              {tutor.availability ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col space-y-2 pb-5">
          {/* Name & Avatar Row */}
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-foreground leading-none">
                  {truncate(tutor.user?.name, 25) || "Unknown Tutor"}
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#1cb89e] fill-[#1cb89e]/10" />
              </div>
              <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                {tutor.title || "Subject Matter Expert"}
              </p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-900 shadow-sm ring-1 ring-[#1cb89e]/10">
              <AvatarImage src={tutor.user?.image || undefined} alt={tutor.user?.name} />
              <AvatarFallback className="bg-[#1cb89e] text-white text-xs font-bold">
                {getInitials(tutor.user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Stats & Rating */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1 text-foreground">
              <Star className="w-3.5 h-3.5 fill-[#1cb89e] text-[#1cb89e]" />
              <span>{(tutor.averageRating || 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{tutor.totalBookIng || 0} bookings</span>
            </div>
          </div>

          {/* Bio Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {tutor.bio || "Helping students master complex concepts through personalized guidance and practical learning strategies."}
          </p>

          {/* Footer: Price & CTA */}
          <div className="pt-4 mt-auto border-t border-gray-50 dark:border-gray-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Hourly Rate</span>
              <div className="flex items-center font-bold text-[#1cb89e]">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-xl">{tutor.rate || 0}</span>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white rounded-lg font-bold group/btn shadow-md hover:shadow-[#1cb89e]/20 transition-all duration-300"
            >
              <Link href={`/tutors/${tutor.id}`} className="flex items-center gap-1.5 px-4">
                View Profile
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}