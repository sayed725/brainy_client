"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { toast } from "sonner";

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
import { Dialog,DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
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
} from "lucide-react";

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";

export default function StudentProfile() {
  const { data: session, isPending } = authClient.useSession();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const user = session?.user;

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
            Sign in to view and update your profile, manage your account, and access all features.
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

    // Simulate API call (replace with real password update logic)
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1400)),
      {
        loading: "Updating password...",
        success: "Password changed successfully!",
        error: "Failed to update password",
      }
    );

    // Reset form
    setOpenDialog(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="px-0 lg:px-5 pb-12 max-w-screen-2xl">
      <DashboardPagesHeader
        title="My Profile"
        subtitle="Manage your personal information and account settings"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 xl:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="border shadow-sm overflow-hidden">
            <div className="h-28 bg-linear-to-r from-teal-600 to-teal-800" />
            <CardContent className="pt-0 relative pb-8">
              <div className="flex flex-col items-center -mt-20">
                <div className="relative group">
                  <Avatar className="w-28 h-28 border-4 border-background shadow-2xl">
                    <AvatarImage
                      src={user.image || "https://i.ibb.co/4RS0VXvL/default-user-image.png"}
                      alt={user.name || "Student"}
                    />
                    <AvatarFallback className="text-4xl bg-teal-700 text-white font-bold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-colors"
                    title="Upload new profile picture"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-5 text-center space-y-1">
                  <h2 className="text-xl font-bold">{user.name || "Student"}</h2>
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/80 dark:text-teal-300">
                    Student
                  </Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 border-t bg-muted/40 px-6 py-6">
              <div className="flex items-center gap-3 w-full text-sm">
                <IdCard className="h-4 w-4 text-teal-600 shrink-0" />
                <span className="font-mono text-muted-foreground truncate">{user.id}</span>
              </div>
              <div className="flex items-center gap-3 w-full text-sm">
                <Mail className="h-4 w-4 text-teal-600 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 w-full text-sm">
                <Phone className="h-4 w-4 text-teal-600 shrink-0" />
                <span>{phoneNumber}</span>
              </div>
            </CardFooter>
          </Card>

          {/* Account Information */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-5 w-5 text-teal-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 dark:bg-teal-950/70 p-3 rounded-full shrink-0">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {formatSafe(session?.user?.createdAt)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="bg-teal-100 dark:bg-teal-950/70 p-3 rounded-full shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account Status</p>
                  <p className="font-medium text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/40 px-6 py-5">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>

                <DialogTitle>
                </DialogTitle>

                <DialogContent className="sm:max-w-md">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (6–18 characters)"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-sm text-destructive mt-1">{passwordError}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Update Password
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
             <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-teal-500" />
                  <div>
                    <h3 className="font-medium">Complete your profile</h3>
                    <p className="text-sm text-muted-foreground">
                      {100}% of your profile is complete
                    </p>
                  </div>
                </div>
                <Progress value={100} className="h-2 flex-1" />
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={() => {
                    toast.success("Profile Completed! 🎉", {
                      description: "Your profile is now complete!",
                      duration: 2000,
                    });
                  }}
                >
                  Complete Profile
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="h-10 px-4 border rounded-md bg-muted/50 flex items-center text-sm">
                  {user.name || "Not set"}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="h-10 px-4 border rounded-md bg-muted/50 flex items-center text-sm">
                  {user.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="h-10 px-4 border rounded-md bg-muted/50 flex items-center text-sm">
                  {phoneNumber}
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/40 flex sm:flex-row flex-col gap-5 lg:gap-0 justify-between items-center py-4 px-6">
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(), "MMM d, yyyy")}
              </p>
              <Button variant="outline" className="gap-1.5">
                <Edit className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}