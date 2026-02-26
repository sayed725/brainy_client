
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";



export default function UserProfileSkelton() {
    return (
       <div className="px-0 lg:px-5 pb-12 max-w-screen-2xl animate-pulse">
        <DashboardPagesHeader
          title="My Profile"
          subtitle="Manage your personal information and account settings"
          icon={User}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-4 gap-8">
          {/* Left Column - Skeleton */}
          <div className="lg:col-span-2 xl:col-span-1 space-y-6">
            {/* Profile Card Skeleton */}
            <Card className="border shadow-sm overflow-hidden">
              <div className="h-28 bg-muted" />
              <CardContent className="pt-0 relative pb-8">
                <div className="flex flex-col items-center -mt-20">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full bg-muted border-4 border-background shadow-2xl" />
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-muted" />
                  </div>

                  <div className="mt-5 text-center space-y-2">
                    <div className="h-7 w-48 mx-auto bg-muted rounded" />
                    <div className="h-6 w-24 mx-auto bg-muted rounded-full" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-5 border-t bg-muted/40 px-6 py-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 w-full">
                    <div className="h-4 w-4 bg-muted rounded-full shrink-0" />
                    <div className="h-5 w-3/4 bg-muted rounded" />
                  </div>
                ))}
              </CardFooter>
            </Card>

            {/* Account Information Skeleton */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-muted rounded-full" />
                  <div className="h-6 w-48 bg-muted rounded" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-muted/50 p-3 rounded-full shrink-0 h-11 w-11" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-5 w-48 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t bg-muted/40 px-6 py-5">
                <div className="w-full h-10 bg-muted rounded-md" />
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Skeleton */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-muted rounded-full" />
                    <div className="space-y-1">
                      <div className="h-5 w-40 bg-muted rounded" />
                      <div className="h-4 w-64 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="h-2 flex-1 bg-muted rounded w-full md:w-auto" />
                  <div className="h-9 w-32 bg-muted rounded" />
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-10 bg-muted rounded-md" />
                  </div>
                ))}
              </CardContent>

              <CardFooter className="border-t bg-muted/40 flex sm:flex-row flex-col gap-5 lg:gap-0 justify-between items-center py-4 px-6">
                <div className="h-5 w-48 bg-muted rounded" />
                <div className="h-10 w-40 bg-muted rounded-md" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
}