"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { MdOutlineRateReview } from "react-icons/md";
import { 
  Check, 
  MoreVertical, 
  Trash, 
  Star, 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  AlertCircle,
  FileText,
  XCircle,
  CheckCircle2,
  Filter,
  Search,
  Eye,
  User,
  BookOpen
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import USPagination from "@/components/shared/USPagination";

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";
import { useAllBookings, useUpdateBookingStatus, useDeleteBooking, extractData } from "@/hooks/useBookings";
import { useAddReview } from "@/hooks/useReviews";

import { VscRequestChanges } from "react-icons/vsc";
import { Booking } from "@/constants/otherinterface";
import { cn } from "@/lib/utils";

export default function ManageBookings() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const userId = session?.user?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: response, isLoading: isBookingsLoading, error: queryError } = useAllBookings({
    userId,
    searchTerm: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    sortBy,
    sortOrder,
    page,
    limit: 10,
  });

  const updateBookingStatusMutation = useUpdateBookingStatus();
  const deleteBookingMutation = useDeleteBooking();
  const addReviewMutation = useAddReview();

  const bookingsData = extractData(response);
  const meta = (response as any)?.meta || (response as any)?.data?.meta;

  const loading = isBookingsLoading;
  const error = queryError ? queryError.message || "Failed to load bookings" : null;
  const filteredBookings = bookingsData as Booking[];

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const isFiltered = searchQuery !== "" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [viewDetailsBooking, setViewDetailsBooking] = useState<Booking | null>(null);

  const handleStatusChange = async (
    bookingId: string,
    newStatus: "CONFIRMED" | "PENDING" | "CANCELLED",
  ) => {
    const actionVerb = {
      CONFIRMED: "Confirming",
      PENDING: "Restoring to pending",
      CANCELLED: "Cancelling",
    }[newStatus];

    const pastVerb = {
      CONFIRMED: "confirmed",
      PENDING: "set to pending",
      CANCELLED: "cancelled",
    }[newStatus];

    try {
      await toast.promise(updateBookingStatusMutation.mutateAsync({ bookingId, status: newStatus }), {
        loading: `${actionVerb} booking...`,
        success: <b>Booking successfully {pastVerb}!</b>,
        error: (err) => (
          <b>{err.message || `Failed to update booking status`}</b>
        ),
      });
    } catch (err) {
      // handled
    }
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await toast.promise(deleteBookingMutation.mutateAsync(bookingId), {
        loading: "Deleting booking...",
        success: <b>Booking successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete booking"}</b>,
      });
    } catch (error) {
      // handled
    }
  };

  const openReviewDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment("");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!userId) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    const reviewData = {
      rating,
      comment: comment.trim() || null,
      tutorId: selectedBooking.tutorId,
      bookingId: selectedBooking.id,
      userId: userId,
    };

    try {
      await toast.promise(
        addReviewMutation.mutateAsync(reviewData),
        {
          loading: "Submitting review...",
          success: <b>Review submitted successfully!</b>,
          error: (err) => {
            if (err.message.includes("Conflict: Unique constraint failed")) {
              return "You have already reviewed this session!";
            }
            return err.message || "Failed to submit review";
          },
        },
      );

      setReviewDialogOpen(false);
    } catch (err) {
      // toast.promise already handles error
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1 font-bold">Confirmed</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 px-3 py-1 font-bold">Pending</Badge>;
      case "CANCELLED":
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 px-3 py-1 font-bold">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="pb-16 max-w-screen-2xl mx-auto space-y-2">
      <DashboardPagesHeader
        title={"My Mentorship Bookings"}
        subtitle={"Keep track of your sessions and share your learning experience"}
        icon={VscRequestChanges}
      />

      {/* Filters and Search Header */}
      <div className="flex flex-row gap-2 sm:gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tutor title, course or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-10 h-10 w-full bg-card border-border focus-visible:ring-[#1cb89e]/20 rounded-xl shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-auto">
          {/* Mobile/Tablet Filter Drawer */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-auto gap-2 border-border hover:bg-muted rounded-xl h-11 px-3 sm:px-4 transition-all">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {isFiltered && <span className="flex h-2 w-2 rounded-full bg-[#1cb89e]" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#1cb89e]" /> Filters
                  </SheetTitle>
                </SheetHeader>
                
                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                  <SheetDescription className="sr-only">Filter and sort bookings table</SheetDescription>
                  
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Booking Status</h3>
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border rounded-xl">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Sort By</h3>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                      const [by, order] = v.split('-');
                      setSortBy(by);
                      setSortOrder(order as "asc" | "desc");
                      setPage(1);
                    }}>
                      <SelectTrigger className="w-full h-11 bg-background border-border rounded-xl">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="createdAt-desc">Newest First</SelectItem>
                        <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                        <SelectItem value="totalPrice-desc">Price: High to Low</SelectItem>
                        <SelectItem value="totalPrice-asc">Price: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-6 border-t bg-muted/20">
                  <Button 
                    onClick={resetFilters} 
                    variant="outline" 
                    disabled={!isFiltered}
                    className="w-full h-12 rounded-xl border-border hover:bg-[#1cb89e]/10 hover:text-[#1cb89e] transition-all font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Inline Filters */}
          <div className="hidden lg:flex flex-wrap gap-2 items-center">
             <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] h-11 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
             </Select>

             <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                const [by, order] = v.split('-');
                setSortBy(by);
                setSortOrder(order as "asc" | "desc");
                setPage(1);
             }}>
                <SelectTrigger className="w-[170px] h-11 rounded-xl">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="totalPrice-desc">Price: High to Low</SelectItem>
                  <SelectItem value="totalPrice-asc">Price: Low to High</SelectItem>
                </SelectContent>
             </Select>

             {isFiltered && (
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters} 
                className="text-muted-foreground hover:text-[#1cb89e] h-10 px-2"
               >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
               </Button>
             )}
          </div>
        </div>
      </div>

      {!loading && filteredBookings.length === 0 ? (
        <Card className="border-none shadow-sm bg-card overflow-hidden">
          <CardContent className="py-20 text-center">
            <div className="flex flex-col items-center justify-center gap-6 px-4 animate-in fade-in zoom-in duration-500">
               <div className="relative">
                  <div className="absolute -inset-4 bg-[#1cb89e]/10 blur-2xl rounded-full" />
                  <div className="relative p-6 md:p-8 rounded-full bg-card border border-border/50 shadow-xl">
                     <CalendarIcon className="h-10 w-10 md:h-12 md:w-12 text-[#1cb89e] opacity-40" />
                  </div>
               </div>
               <div className="space-y-2 max-w-[320px] mx-auto">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">No Bookings Yet</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed px-2">
                     You haven&apos;t scheduled any mentorship sessions. <br className="hidden sm:block" /> Start your learning journey today!
                  </p>
               </div>
               <Button asChild size="lg" className="w-full sm:w-auto bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95">
                  <a href="/tutors">Find a Mentor</a>
               </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[80px] font-bold text-[10px] uppercase tracking-widest pl-6 text-muted-foreground">#</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Tutor Session</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Price</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Schedule</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest pr-8 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse border-border/30">
                        <TableCell colSpan={6} className="p-4">
                           <div className="h-12 bg-muted/40 rounded-xl w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                  filteredBookings.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      className="group border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-background shadow-sm shrink-0">
                            <img
                              src={booking.tutor?.poster ?? "https://i.ibb.co/4RS0VXvL/default-user-image.png"}
                              alt={booking.tutor?.title ?? "Tutor"}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate max-w-[200px] text-foreground">
                              {booking.tutor?.title || "Mentorship Session"}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                               <Clock className="h-3 w-3" />
                               {booking.createdAt ? moment(booking.createdAt).fromNow() : "—"}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                           <span className="font-black text-foreground flex items-center gap-0.5">
                             <DollarSign className="h-3 w-3 text-[#1cb89e]" />
                             {booking.totalPrice || 0}
                           </span>
                           <span className="text-[10px] text-muted-foreground font-medium">Platform Total</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                             <CalendarIcon className="h-3 w-3 text-[#1cb89e]" />
                             {booking.startTime ? moment(booking.startTime).format("MMM D, YYYY") : "—"}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium pl-5">
                             {booking.startTime ? moment(booking.startTime).format("h:mm A") : "—"}
                             <span className="opacity-40 px-1">→</span>
                             {booking.endTime ? moment(booking.endTime).format("h:mm A") : "—"}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>

                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                           <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setViewDetailsBooking(booking)}
                              className="h-9 w-9 rounded-xl border border-border/50 hover:bg-background hover:shadow-sm text-muted-foreground hover:text-[#1cb89e]"
                           >
                              <Eye className="h-4 w-4" />
                           </Button>

                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/50 hover:bg-background hover:shadow-sm">
                                 <MoreVertical className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>

                             <DropdownMenuContent align="end" className="w-48 rounded-xl border-border shadow-xl">
                               {booking.status === "PENDING" && (
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                                   className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer py-2.5 font-semibold"
                                 >
                                   <XCircle className="mr-2 h-4 w-4" />
                                   Cancel Booking
                                 </DropdownMenuItem>
                               )}

                               {booking.status === "CANCELLED" && (
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(booking.id, "PENDING")}
                                   className="text-amber-500 focus:bg-amber-500/10 focus:text-amber-500 cursor-pointer py-2.5 font-semibold"
                                 >
                                   <Clock className="mr-2 h-4 w-4" />
                                   Re-request
                                 </DropdownMenuItem>
                               )}

                               {booking.status === "CONFIRMED" && (
                                 <DropdownMenuItem
                                   onClick={() => openReviewDialog(booking)}
                                   className="text-[#1cb89e] focus:bg-[#1cb89e]/10 focus:text-[#1cb89e] cursor-pointer py-2.5 font-semibold"
                                 >
                                   <MdOutlineRateReview className="mr-2 h-4 w-4" />
                                   Rate & Review
                                 </DropdownMenuItem>
                               )}

                               <DropdownMenuSeparator className="opacity-50" />

                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                   <DropdownMenuItem
                                     className="text-muted-foreground hover:text-rose-600 cursor-pointer py-2.5 font-semibold"
                                     onSelect={(e) => e.preventDefault()}
                                   >
                                     <Trash className="mr-2 h-4 w-4" />
                                     Remove Log
                                   </DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent className="rounded-3xl">
                                   <AlertDialogHeader>
                                     <AlertDialogTitle className="text-2xl font-black tracking-tight">Are you absolutely sure?</AlertDialogTitle>
                                     <AlertDialogDescription className="text-sm leading-relaxed">
                                       This action will permanently delete this booking record from your dashboard. This cannot be undone.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter className="gap-3 mt-4">
                                     <AlertDialogCancel className="rounded-2xl h-12 font-bold">No, Keep it</AlertDialogCancel>
                                     <AlertDialogAction
                                       onClick={() => handleDelete(booking.id)}
                                       className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-12 font-bold px-8 shadow-lg shadow-rose-600/20"
                                     >
                                       Yes, Delete
                                     </AlertDialogAction>
                                   </AlertDialogFooter>
                                 </AlertDialogContent>
                               </AlertDialog>
                             </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </div>
      </Card>
      )}

      {meta && meta.totalPage > 1 && (
        <div className="mt-4 bg-card border rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* Enhanced Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#1cb89e]/10 flex items-center justify-center mb-2 mx-auto sm:mx-0">
               <MdOutlineRateReview className="h-8 w-8 text-[#1cb89e]" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Share Your Experience</DialogTitle>
            <DialogDescription className="text-sm">
              Your feedback helps <span className="font-bold text-foreground">{selectedBooking?.tutor?.title || "the tutor"}</span> improve and helps other students choose the right mentor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Session Rating</Label>
              <div className="flex justify-between px-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`h-10 w-10 transition-all ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                          : "text-muted-foreground/30 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-1">
                 <span>Poor</span>
                 <span>Excellent</span>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <Label htmlFor="comment" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Feedback</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you learn? How was the teaching style? (Optional)"
                className="min-h-[120px] rounded-2xl border-border/50 focus-visible:ring-[#1cb89e] p-4 text-sm leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setReviewDialogOpen(false)}
              className="h-12 font-bold rounded-2xl flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={rating === 0}
              className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold h-12 rounded-2xl flex-1 shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95"
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={!!viewDetailsBooking} onOpenChange={(open) => !open && setViewDetailsBooking(null)}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-8 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-border/50 shadow-sm">
                  <img 
                    src={viewDetailsBooking?.tutor?.poster ?? "https://i.ibb.co/4RS0VXvL/default-user-image.png"} 
                    alt="Tutor" 
                    className="h-full w-full object-cover"
                  />
               </div>
               <div className="min-w-0">
                  <DialogTitle className="text-2xl font-black tracking-tight">{viewDetailsBooking?.tutor?.title || "Mentorship Session"}</DialogTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    ID: <span className="font-mono text-xs">{viewDetailsBooking?.id}</span>
                  </p>
               </div>
            </div>
            <DialogDescription className="text-base font-medium text-foreground/80">
              Complete overview of your scheduled mentorship session and transaction details.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-8">
             {/* Session Info Grid */}
             <div className="grid grid-cols-2 gap-6 bg-muted/30 p-6 rounded-3xl border border-border/50">
                <div className="space-y-1.5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Date</p>
                   <p className="font-bold text-sm flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-[#1cb89e]" />
                      {viewDetailsBooking?.startTime ? moment(viewDetailsBooking.startTime).format("MMMM D, YYYY") : "—"}
                   </p>
                </div>
                <div className="space-y-1.5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                   {viewDetailsBooking?.status && getStatusBadge(viewDetailsBooking.status)}
                </div>
                <div className="space-y-1.5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Time</p>
                   <p className="font-bold text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#1cb89e]" />
                      {viewDetailsBooking?.startTime ? moment(viewDetailsBooking.startTime).format("h:mm A") : "—"}
                   </p>
                </div>
                <div className="space-y-1.5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Time</p>
                   <p className="font-bold text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#1cb89e]" />
                      {viewDetailsBooking?.endTime ? moment(viewDetailsBooking.endTime).format("h:mm A") : "—"}
                   </p>
                </div>
             </div>

             {/* Financials */}
             <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Payment Summary</h3>
                <div className="bg-card border border-border/50 rounded-3xl overflow-hidden">
                   <div className="p-4 flex justify-between items-center border-b border-border/30">
                      <span className="text-sm font-medium text-muted-foreground">Base Session Price</span>
                      <span className="font-bold">${viewDetailsBooking?.totalPrice || 0}</span>
                   </div>
                   <div className="p-4 flex justify-between items-center bg-emerald-50/30 dark:bg-emerald-950/10">
                      <span className="text-sm font-black text-foreground uppercase tracking-tight">Total Charged</span>
                      <span className="text-xl font-black text-[#1cb89e]">${viewDetailsBooking?.totalPrice || 0}</span>
                   </div>
                </div>
             </div>

             {/* Session Topics / Description Mock */}
             <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Learning Goals
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-4 rounded-2xl border border-dashed border-border">
                  This session focuses on <span className="text-foreground font-bold">{viewDetailsBooking?.tutor?.title}</span>. Please come prepared with your questions and any specific topics you want to cover during the hour.
                </p>
             </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={() => setViewDetailsBooking(null)}
              className="w-full h-12 rounded-2xl bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95"
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
