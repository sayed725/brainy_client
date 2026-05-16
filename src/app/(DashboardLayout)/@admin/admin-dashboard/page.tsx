// app/admin/admin-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  CalendarCheck, 
  Clock, 
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowUpRight,
  UserPlus,
  ArrowRight,
  Star
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

import { useAdminData } from "@/hooks/useAdmin";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";
import DashboardSkeleton from "@/components/modules/admin/DashboardSkeleton";
import AdminStatCard from "@/components/modules/admin/AdminStatCard";
import { cn } from "@/lib/utils";

const COLORS = ["#1cb89e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const userId = session?.user?.id;

  const { data: stats, isLoading: isDataLoading, error: queryError, refetch } = useAdminData();
  const error = queryError ? queryError.message || "Failed to load dashboard data" : null;
  const loading = isDataLoading || (userId && !stats && !error);

  const handleRefresh = () => {
    refetch();
    toast.info("Updating platform data...");
  };

  if (isSessionLoading || (!userId && !loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-[#1cb89e] border-t-transparent rounded-full animate-spin" />
           <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="p-6 rounded-full bg-rose-50 text-rose-500">
           <AlertCircle className="h-16 w-16" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black">System Sync Failed</h2>
           <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
        </div>
        <Button onClick={handleRefresh} className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg">
           Reconnect to System
        </Button>
      </div>
    );
  }

  if (loading || !stats) {
    return <DashboardSkeleton />;
  }

  const { totals, monthlyData, categoryStats, userRoleStats, recentUsers, recentBookings, recentTutors } = stats as any;

  return (
    <div className="pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-card/50 backdrop-blur-xl border border-border/50 p-6  rounded-[2rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
           <TrendingUp className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10 space-y-1">
          <Badge variant="outline" className="bg-[#1cb89e]/10 text-[#1cb89e] border-[#1cb89e]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
            System Overview
          </Badge>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
             Platform Command Center
          </h1>
          <p className="text-sm font-bold text-muted-foreground opacity-60">
            Real-time analytics & activity monitoring • {format(new Date(), "MMMM do, yyyy")}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="relative z-10 h-12 px-6 rounded-2xl bg-card border-none shadow-sm hover:bg-muted font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isDataLoading && "animate-spin")} />
          Refresh Sync
        </Button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Platform Revenue"
          value={`$${totals.totalRevenue}`}
          icon={<DollarSign className="h-5 w-5" />}
          description="Confirmed transactions"
          trend="positive"
        />
        <AdminStatCard
          title="Active Students"
          value={totals.totalStudents}
          icon={<GraduationCap className="h-5 w-5" />}
          description="Enrolled & learning"
        />
        <AdminStatCard
          title="Top Tier Tutors"
          value={totals.totalTutors}
          icon={<BookOpen className="h-5 w-5" />}
          description="Verified instructors"
        />
        <AdminStatCard
          title="User Ecosystem"
          value={totals.totalUsers}
          icon={<Users className="h-5 w-5" />}
          description="Combined platform users"
        />
      </div>

      {/* Charts & Secondary Stats */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Revenue & Growth Chart */}
        <Card className="lg:col-span-8 border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle className="text-xl font-black">Revenue & Growth Pulse</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Monthly confirmed booking performance</CardDescription>
               </div>
               <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Growth Active</span>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1cb89e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1cb89e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", padding: "12px" }}
                    labelStyle={{ fontWeight: 900, color: "#1cb89e", marginBottom: "4px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1cb89e" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={0} 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution Pie */}
        <Card className="lg:col-span-4 border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 pb-4">
             <CardTitle className="text-xl font-black">Community Ratios</CardTitle>
             <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Distribution by role</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="count"
                    animationDuration={2000}
                  >
                    {userRoleStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 mt-4">
              {userRoleStats.map((entry: any, index: number) => (
                <div key={entry.role} className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{entry.role}</span>
                  </div>
                  <span className="text-sm font-black">{entry.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution Bar */}
      <Card className="border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 pb-4">
             <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#1cb89e]" />
                <CardTitle className="text-xl font-black">Learning Vertical Performance</CardTitle>
             </div>
             <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60 ml-8">Total bookings per category vertical</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[250px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 900, fill: "#94a3b8" }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(28, 184, 158, 0.05)' }}
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#1cb89e" 
                    radius={[8, 8, 0, 0]} 
                    barSize={40}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black">Live Booking Feed</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Latest platform session requests</CardDescription>
            </div>
            {/* <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#1cb89e]/10 text-[#1cb89e] gap-2 group">
              View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Button> */}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Student</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Tutor</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="pr-8 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking: any) => (
                  <TableRow key={booking.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                           <AvatarImage src={booking.user?.image} />
                           <AvatarFallback className="text-[10px] font-black">{booking.user?.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-bold text-foreground">{booking.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-muted-foreground">{booking.tutor?.user?.name || "Tutor"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-black text-[#1cb89e]">${booking.totalPrice}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-xl font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 border transition-colors",
                          booking.status === "CONFIRMED" && "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
                          booking.status === "PENDING" && "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
                          booking.status === "CANCELLED" && "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right text-[10px] font-black uppercase text-muted-foreground opacity-50">
                      {format(new Date(booking.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Tutors & Users */}
        <div className="space-y-6">
           {/* Recent Users */}
           <Card className="border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  New Explorers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                {recentUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                        <AvatarImage src={u.image} />
                        <AvatarFallback className="font-black text-xs">{u.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground group-hover:text-[#1cb89e] transition-colors">{u.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground opacity-60 tracking-tight lowercase">{u.email}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-lg text-[9px] font-black border-none bg-muted/50 uppercase tracking-widest">{u.role}</Badge>
                  </div>
                ))}
              </CardContent>
           </Card>

           {/* New Tutors */}
           <Card className="border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
              <CardHeader className="p-6 pb-2">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                   <GraduationCap className="w-5 h-5 text-amber-500" />
                   Rising Mentors
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                 <div className="space-y-4">
                    {recentTutors.map((t: any) => (
                      <div key={t.id} className="flex gap-4 p-3 rounded-2xl border border-border/30 hover:border-[#1cb89e]/30 transition-colors bg-muted/10">
                        <img src={t.poster} alt="" className="h-12 w-12 rounded-xl object-cover shadow-sm" />
                        <div className="flex flex-col flex-1 min-w-0">
                           <span className="text-xs font-black text-foreground line-clamp-1">{t.title}</span>
                           <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] font-black text-[#1cb89e] uppercase tracking-widest">${t.rate}/hr</span>
                              <div className="flex items-center gap-1">
                                 <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                 <span className="text-[10px] font-black">{t.averageRating.toFixed(1)}</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
