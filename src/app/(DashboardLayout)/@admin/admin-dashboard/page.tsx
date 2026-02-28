"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  CalendarCheck, 
  Clock, 
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { toast } from "sonner"

import { getallAdminData } from "@/actions/admin.action"
import { AdminDashboardData } from "@/constants/otherinterface"
import { authClient } from "@/lib/auth-client"

import { format } from "date-fns"
import DashboardSkeleton from "@/components/modules/admin/DashboardSkeleton"
import AdminStatCard from "@/components/modules/admin/AdminStatCard"

// Helper to format currency (you can put this in lib/utils.ts)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function AdminDashboard() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminDashboardData | null>(null)

  const userId = session?.user?.id

  const fetchAdminData = async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const result = await getallAdminData()
      if (result.error) {
        throw new Error(result.error)
      }
      setStats(result.data)
    } catch (err: any) {
      const msg = err.message || "Failed to load dashboard data"
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchAdminData()
    }
  }, [userId])

  const handleRefresh = () => {
    fetchAdminData()
    toast.info("Refreshing dashboard...")
  }

  if (isSessionLoading || (!userId && !loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading session...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    )
  }

  if (loading || !stats) {
    return <DashboardSkeleton />
  }

  return (
    <div className="px-0 lg:px-6 pb-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-white flex items-center gap-3">Admin Dashboard</h1>
          <p className="text-gray-700 text-base md:text-lg lg:text-xl mt-1 ml-0.5 dark:text-white font-medium lg:whitespace-pre-line">
            Overview of platform activity • Last updated {format(new Date(), "PPp")}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />}
          description="All registered users"
        />
        <AdminStatCard
          title="Students"
          value={stats.totalStudents}
          icon={<GraduationCap className="h-5 w-5" />}
          description="Active learners"
        />
        <AdminStatCard
          title="Tutors"
          value={stats.totalTutors}
          icon={<BookOpen className="h-5 w-5" />}
          description="Active instructors"
        />
        <AdminStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenueResult._sum.totalPrice)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Confirmed bookings revenue"
          trend="positive"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          title="Bookings"
          value={stats.totalBookings}
          icon={<CalendarCheck className="h-5 w-5" />}
          description="All bookings"
          className="lg:col-span-1"
        />
        <AdminStatCard
          title="Confirmed"
          value={stats.totalConfirmedBookings}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          description="Completed / confirmed"
          className="lg:col-span-1"
        />
        <AdminStatCard
          title="Pending"
          value={stats.totalPendingBookings}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          description="Awaiting confirmation"
          className="lg:col-span-1"
        />
      </div>

      {/* Recent Activity - 3 Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Users */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Last registered accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.role === "TUTOR" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : booking.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(booking.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Tutors */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New Tutors</CardTitle>
            <CardDescription>Recently joined instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentTutors.map((tutor) => (
                <div key={tutor.id} className="flex gap-4">
                  <div className="shrink-0">
                    <img
                      src={tutor.poster}
                      alt={tutor.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium leading-tight line-clamp-2">
                      {tutor.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{tutor.rate}/hr</span>
                      <span>•</span>
                      <span>{tutor.totalBookIng} bookings</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-medium">{tutor.averageRating.toFixed(1)}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



