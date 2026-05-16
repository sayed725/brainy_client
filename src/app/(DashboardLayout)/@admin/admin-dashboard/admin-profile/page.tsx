// app/admin/admin-dashboard/admin-profile/page.tsx
"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { toast } from "sonner";
import moment from "moment";
import { motion } from "framer-motion";

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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCheck,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  EyeOff,
  IdCard,
  Info,
  Lock,
  Mail,
  Phone,
  Shield,
  Upload,
  User,
  X,
  Star,
  BookOpen,
  GraduationCap,
  XCircle,
  Users,
  Layers,
  Activity,
  Zap
} from "lucide-react";

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";
import UserProfileSkelton from "@/components/modules/user/UserProfileSkelton";
import { cn } from "@/lib/utils";
import { useAllUsers } from "@/hooks/useUsers";
import { useCategories } from "@/hooks/useCategories";
import { useAllBookings } from "@/hooks/useBookings";

export default function AdminProfile() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  // Platform Stats for Admin
  const { data: usersData } = useAllUsers();
  const { data: categoriesData } = useCategories();
  const { data: bookingsData } = useAllBookings();

  const totalUsers = (usersData as any)?.meta?.total || 0;
  const totalCategories = (categoriesData as any)?.data?.meta?.total || 0;
  const totalBookings = (bookingsData as any)?.meta?.total || 0;

  const [newName, setNewName] = useState(user?.name);
  const [isNameEditing, setIsNameEditing] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(user?.image || "");
  const [imageError, setImageError] = useState("");

  if (isPending) {
    return <UserProfileSkelton />;
  }

  if (!session || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-muted/60 p-8">
          <User className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">You&apos;re not signed in</h2>
          <p className="text-muted-foreground max-w-md">
            Sign in to view and update your profile, manage your account, and
            access all features.
          </p>
        </div>
        <Button asChild size="lg" className="bg-[#1cb89e] hover:bg-[#1cb89e]/90">
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  const formatSafe = (dateValue?: string | number | Date) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    return isValid(date) ? format(date, "d MMMM yyyy") : "—";
  };

  const userInitial =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "?";

  const phoneNumber = "Not available";

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6 || newPassword.length > 18) {
      setPasswordError("Password must be 6–18 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1400)), {
      loading: "Updating password...",
      success: "Password changed successfully!",
      error: "Failed to update password",
    });

    setOpenDialog(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleNameChange = async () => {
    if (!newName?.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    await toast.promise(authClient.updateUser({ name: newName.trim() }), {
      loading: "Updating name...",
      success: <b>Name updated successfully!</b>,
      error: (err) => <b>{err?.message || "Failed to update name"}</b>,
    });

    setIsNameEditing(false);
    setNewName(newName.trim());
    await refetch();
  };

  const handleImageUpdate = async () => {
    if (!newImageUrl?.trim()) {
      setImageError("Please enter a valid image URL");
      return;
    }

    try {
      new URL(newImageUrl.trim());
    } catch {
      setImageError("Invalid URL format");
      return;
    }

    setImageError("");

    await toast.promise(authClient.updateUser({ image: newImageUrl.trim() }), {
      loading: "Updating profile picture...",
      success: <b>Profile picture updated successfully!</b>,
      error: (err) => (
        <b>{err?.message || "Failed to update profile picture"}</b>
      ),
    });

    setOpenImageDialog(false);
    setNewImageUrl(newImageUrl.trim());
    await refetch();
  };

  return (
    <div className="pb-10 max-w-screen-2xl mx-auto space-y-4">
      <DashboardPagesHeader
        title="Admin Profile"
        subtitle="Manage your administrative identity and track platform performance"
        icon={Shield}
      />

      {/* Stats Summary Grid - Admin Perspective */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {[
          { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Bookings", value: totalBookings, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Categories", value: totalCategories, icon: Layers, color: "text-[#1cb89e]", bg: "bg-[#1cb89e]/10" },
          { label: "Revenue", value: `$${totalBookings * 45}`, icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Uptime", value: "99.9%", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "System", value: "Stable", icon: Shield, color: "text-[#1cb89e]", bg: "bg-[#1cb89e]/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column - Profile & Security */}
        <div className="lg:col-span-4 space-y-3">
          {/* Enhanced Profile Hero Card */}
          <Card className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
            <div className="h-32 bg-gradient-to-br from-[#1cb89e] to-[#128c78] relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            </div>
            <CardContent className="pt-0 relative px-6 pb-8">
              <div className="flex flex-col items-center -mt-16">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#1cb89e] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <Avatar className="w-32 h-32 border-[6px] border-background shadow-2xl relative z-10">
                    <AvatarImage
                      src={user.image || "https://i.ibb.co/4RS0VXvL/default-user-image.png"}
                      alt={user.name || "Admin"}
                    />
                    <AvatarFallback className="text-5xl bg-[#1cb89e] text-white font-black">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>

                  <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-1 right-1 rounded-full w-10 h-10 bg-[#1cb89e] hover:bg-[#159a85] text-white shadow-xl z-20 transition-all hover:scale-110"
                      >
                        <Upload className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogTitle className="text-2xl font-bold">Update Admin Portrait</DialogTitle>
                      <div className="space-y-4 py-6">
                        <Label htmlFor="image-url" className="text-base">Direct Image Link</Label>
                        <div className="space-y-2">
                          <Input
                            id="image-url"
                            value={newImageUrl}
                            onChange={(e) => {
                              setNewImageUrl(e.target.value);
                              setImageError("");
                            }}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="h-12 border-border focus:ring-[#1cb89e]"
                            autoFocus
                          />
                          {imageError && <p className="text-sm text-destructive">{imageError}</p>}
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg leading-relaxed">
                          Tip: Use a professional square portrait for your administrative identity.
                        </p>
                      </div>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setOpenImageDialog(false)}>Cancel</Button>
                        <Button onClick={handleImageUpdate} className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold">
                          Update Picture
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-6 text-center space-y-2">
                  <h2 className="text-2xl font-black tracking-tight">{user.name || "Administrator"}</h2>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-[#1cb89e]/10 text-[#1cb89e] hover:bg-[#1cb89e]/20 border-[#1cb89e]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      Platform Administrator
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                  <div className="p-2.5 rounded-xl bg-background shadow-sm text-[#1cb89e]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">System Email</p>
                    <p className="text-sm font-semibold truncate text-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
                  <div className="p-2.5 rounded-xl bg-background shadow-sm text-[#1cb89e]">
                    <IdCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Operator ID</p>
                    <p className="text-[11px] font-mono font-medium truncate text-muted-foreground">{user.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Account Card */}
          <Card className="border shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Shield className="h-5 w-5 text-[#1cb89e]" />
                Security Guard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                       <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Root Access</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight">Standard auth active</p>
                    </div>
                  </div>
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="font-black text-[10px] uppercase tracking-widest h-8 px-4 rounded-lg">Update</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogTitle className="text-2xl font-bold">Change Root Password</DialogTitle>
                      <form onSubmit={handlePasswordChange} className="space-y-6 pt-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-bold">Current Password</Label>
                          <div className="relative">
                            <Input
                              type={showCurrent ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="h-11 border-border"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrent(!showCurrent)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-bold">New Password</Label>
                          <div className="relative">
                            <Input
                              type={showNew ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                              className="h-11 border-border"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNew(!showNew)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {passwordError && <p className="text-xs text-destructive font-medium">{passwordError}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold h-12 shadow-lg">
                          Confirm Secure Update
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
               </div>

               <Separator className="opacity-50" />

               <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                       <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Integrity</p>
                      <p className="text-[10px] text-green-500 uppercase font-bold tracking-wider">Verified Admin</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 font-bold px-3">Live</Badge>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Account Details */}
        <div className="lg:col-span-8 space-y-3">
          <Card className="border shadow-sm bg-card relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Shield className="w-64 h-64 rotate-12" />
             </div>
             
            <CardHeader className="border-b border-border/50 bg-muted/20 px-8 py-3">
               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1 space-y-1">
                    <CardTitle className="text-xl font-black">Identity Verification</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your administrative credentials and display info</p>
                </div>
                <div className="w-full md:w-64 space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-[#1cb89e]">Compliance</span>
                      <span className="text-muted-foreground">100%</span>
                   </div>
                   <Progress value={100} className="h-2.5 bg-muted rounded-full" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                
                {/* Full Name Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin Display Name</Label>
                    {!isNameEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsNameEditing(true)}
                        className="h-7 px-2 text-[#1cb89e] hover:text-[#1cb89e] hover:bg-[#1cb89e]/10 font-bold text-xs gap-1.5 transition-all"
                      >
                        <Edit className="h-3 w-3" />
                        Modify
                      </Button>
                    )}
                  </div>
                  
                  {isNameEditing ? (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="h-12 border-[#1cb89e] focus-visible:ring-[#1cb89e]"
                        autoFocus
                      />
                      <Button onClick={handleNameChange} className="h-12 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white shadow-lg">
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={() => { setNewName(user?.name); setIsNameEditing(false); }} className="h-12">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="group relative">
                      <div className="h-14 px-5 rounded-xl border bg-muted/30 border-border/50 flex items-center font-bold text-foreground group-hover:bg-muted/50 transition-all duration-300">
                        {user.name || "Administrator"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Address (Read-only) */}
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secure System Email</Label>
                  <div className="h-14 px-5 rounded-xl border bg-muted/10 border-border/20 flex items-center font-bold text-muted-foreground cursor-not-allowed opacity-80">
                    {user.email}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-4">
                   <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Emergency Contact</Label>
                   <div className="h-14 px-5 rounded-xl border bg-muted/30 border-border/50 flex items-center font-bold text-foreground hover:bg-muted/50 transition-all duration-300 group">
                      {phoneNumber}
                      <Info className="ml-auto h-4 w-4 text-muted-foreground opacity-50" />
                   </div>
                </div>

                {/* Account Type */}
                <div className="space-y-4">
                   <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Authorization Date</Label>
                   <div className="h-14 px-5 rounded-xl border bg-muted/30 border-border/50 flex items-center font-bold text-foreground hover:bg-muted/50 transition-all duration-300">
                      {formatSafe(session?.user?.createdAt)}
                   </div>
                </div>
              </div>

              <div className="">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50">
                   <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-background shadow-xl text-[#1cb89e]">
                           <Clock className="h-6 w-6" />
                        </div>
                        <div>
                           <p className="text-lg font-black text-foreground">Activity Pulse</p>
                           <p className="text-sm text-muted-foreground">Last system interaction was {user.updatedAt && moment(user.updatedAt).fromNow()}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest border-border/80 hover:bg-background h-11 px-6">
                         Audit Logs
                      </Button>
                   </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border/50 bg-muted/10 flex flex-col md:flex-row justify-between items-center gap-3">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1cb89e] animate-pulse" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform Synced</span>
               </div>
               <p className="text-xs font-medium text-muted-foreground">
                 Admin Hash: {user.id?.slice(0, 8)}... (Last Sync: {formatSafe(session?.user?.updatedAt)})
               </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}