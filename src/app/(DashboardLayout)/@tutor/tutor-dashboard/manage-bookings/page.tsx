"use client";

import moment from "moment";
import { 
  Check, 
  MoreVertical, 
  Trash, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign,
  ChevronRight,
  Eye,
  XCircle,
  CheckCircle2,
  User,
  GraduationCap
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
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  useAllBookings,
  useUpdateBookingStatus,
  useDeleteBooking,
  extractData,
} from "@/hooks/useBookings";

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { VscRequestChanges } from "react-icons/vsc";
import { Booking } from "@/constants/otherinterface";
import { cn } from "@/lib/utils";
import USPagination from "@/components/shared/USPagination";

export default function ManageBookings() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Filtering and Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch Bookings with Query Params
  const { data: response, isLoading: isBookingsLoading, error: queryError } = useAllBookings({
    searchTerm: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sort: sortBy,
    order: sortOrder,
    page,
    limit: 10
  });

  const updateBookingStatusMutation = useUpdateBookingStatus();
  const deleteBookingMutation = useDeleteBooking();

  const bookingsData = extractData(response);
  const meta = (response as any)?.meta || (response as any)?.data?.meta;
  const loading = isBookingsLoading;
  const bookings = bookingsData as Booking[];

  const isFiltered = searchQuery !== "" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

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
        error: (err) => <b>{err.message || `Failed to update booking status`}</b>,
      });
    } catch (err) {}
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await toast.promise(deleteBookingMutation.mutateAsync(bookingId), {
        loading: "Deleting booking...",
        success: <b>Booking successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete booking"}</b>,
      });
    } catch (error) {}
  };

  return (
    <div className="pb-16 max-w-screen-2xl mx-auto space-y-4">
      <DashboardPagesHeader
        title="Student Booking Requests"
        subtitle="Review and manage your incoming mentorship sessions"
        icon={VscRequestChanges}
      />

      {/* Search and Filters */}
      <div className="flex flex-row gap-2 sm:gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10  bg-card border-none shadow-sm rounded-xl sm:rounded-2xl focus-visible:ring-[#1cb89e]/30 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 min-w-[160px] bg-card border-none shadow-sm rounded-2xl text-sm font-black px-6 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              disabled={!isFiltered}
              className="h-10 px-8 rounded-2xl bg-card border-none shadow-sm hover:bg-muted font-black text-sm disabled:opacity-50 transition-all active:scale-95"
            >
              Reset
            </Button>
          </div>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden h-11 w-11 p-0 bg-card border-none shadow-sm rounded-xl relative">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {isFiltered && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#1cb89e] rounded-full border-2 border-card" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col border-none shadow-2xl">
              <SheetHeader className="p-6 border-b border-border/50">
                <SheetTitle className="text-xl font-black flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#1cb89e]" /> Filters
                </SheetTitle>
              </SheetHeader>
              
              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                <SheetDescription className="sr-only">Filter and sort booking requests</SheetDescription>
                
                <div className="space-y-3">
                  <h3 className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Booking Status</h3>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-full h-12 bg-muted/30 border-border/50 rounded-2xl font-bold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Sort Requests</h3>
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
                    const [by, order] = v.split('-');
                    setSortBy(by);
                    setSortOrder(order as "asc" | "desc");
                    setPage(1);
                  }}>
                    <SelectTrigger className="w-full h-12 bg-muted/30 border-border/50 rounded-2xl font-bold">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="createdAt-desc">Newest First</SelectItem>
                      <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                      <SelectItem value="totalPrice-desc">Earnings: High to Low</SelectItem>
                      <SelectItem value="totalPrice-asc">Earnings: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-muted/10">
                <Button 
                  onClick={resetFilters} 
                  variant="outline" 
                  disabled={!isFiltered}
                  className="w-full h-12 rounded-2xl border-none bg-background shadow-sm hover:bg-[#1cb89e]/10 hover:text-[#1cb89e] transition-all font-black"
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {!loading && bookings.length === 0 ? (
        <Card className="border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
          <CardContent className="py-20 text-center">
            <div className="flex flex-col items-center justify-center gap-6 px-4 animate-in fade-in zoom-in duration-500">
               <div className="relative">
                  <div className="absolute -inset-4 bg-[#1cb89e]/10 blur-2xl rounded-full" />
                  <div className="relative p-6 md:p-8 rounded-full bg-card border border-border/50 shadow-xl">
                     <CalendarIcon className="h-10 w-10 md:h-12 md:w-12 text-[#1cb89e] opacity-40" />
                  </div>
               </div>
               <div className="space-y-2 max-w-[320px] mx-auto">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">No Requests Found</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                     You don&apos;t have any booking requests matching your current filters.
                  </p>
               </div>
               <Button variant="outline" onClick={resetFilters} className="rounded-2xl h-12 px-8 font-bold border-2">
                  Clear All Filters
               </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm bg-card overflow-hidden rounded-[2rem]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-widest pl-8 text-muted-foreground">#</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Student Info</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Price/Rate</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Session Timing</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-8 text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse border-border/30">
                      <TableCell colSpan={6} className="p-4">
                         <div className="h-16 bg-muted/40 rounded-2xl w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  bookings.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      className="group border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="pl-8 font-mono text-xs text-muted-foreground font-black">
                        {(index + 1 + (page - 1) * 10).toString().padStart(2, "0")}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-[#1cb89e]/10 flex items-center justify-center overflow-hidden border border-[#1cb89e]/20 group-hover:scale-105 transition-transform">
                             <img 
                               src={booking.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || "U")}&background=1cb89e&color=fff`} 
                               alt="Student" 
                               className="h-full w-full object-cover" 
                             />
                          </div>
                          <div>
                            <p className="font-black text-sm text-foreground line-clamp-1">{booking.user?.name || "Student"}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">{booking.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-[#1cb89e]">${booking.totalPrice}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Total Earn</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                            <CalendarIcon className="h-3 w-3 text-[#1cb89e]" />
                            {moment(booking.startTime).format("MMM D, YYYY")}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                            <Clock className="h-3 w-3" />
                            {moment(booking.startTime).format("hh:mm A")} - {moment(booking.endTime).format("hh:mm A")}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-lg font-black text-[10px] uppercase tracking-widest border-none px-3 py-1",
                            booking.status === "PENDING" && "bg-amber-500/10 text-amber-500",
                            booking.status === "CONFIRMED" && "bg-emerald-500/10 text-emerald-500",
                            booking.status === "CANCELLED" && "bg-rose-500/10 text-rose-500"
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-1 sm:gap-2 transition-all duration-300">
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => {
                               setSelectedBooking(booking);
                               setDetailsOpen(true);
                             }}
                             className="h-9 w-9 rounded-xl hover:bg-[#1cb89e]/10 hover:text-[#1cb89e] text-muted-foreground hover:scale-110 active:scale-95 transition-all"
                           >
                             <Eye className="h-4.5 w-4.5" />
                           </Button>
 
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:scale-110 active:scale-95 transition-all"
                               >
                                 <MoreVertical className="h-4.5 w-4.5" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
                               {booking.status === "PENDING" && (
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                                   className="rounded-xl font-bold text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 cursor-pointer p-3"
                                 >
                                   <CheckCircle2 className="mr-2 h-4 w-4" />
                                   Confirm Booking
                                 </DropdownMenuItem>
                               )}
 
                               {booking.status === "CONFIRMED" && (
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(booking.id, "PENDING")}
                                   className="rounded-xl font-bold text-amber-500 focus:text-amber-500 focus:bg-amber-500/10 cursor-pointer p-3"
                                 >
                                   <Clock className="mr-2 h-4 w-4" />
                                   Move to Pending
                                 </DropdownMenuItem>
                               )}
 
                               {booking.status !== "CANCELLED" && (
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                                   className="rounded-xl font-bold text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 cursor-pointer p-3"
                                 >
                                   <XCircle className="mr-2 h-4 w-4" />
                                   Cancel Session
                                 </DropdownMenuItem>
                               )}
 
                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                   <DropdownMenuItem
                                     onSelect={(e) => e.preventDefault()}
                                     className="rounded-xl font-bold text-rose-600 focus:text-white focus:bg-rose-600 cursor-pointer p-3"
                                   >
                                     <Trash className="mr-2 h-4 w-4" />
                                     Delete Permanently
                                   </DropdownMenuItem>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8">
                                   <AlertDialogHeader>
                                     <AlertDialogTitle className="text-2xl font-black">Final Confirmation</AlertDialogTitle>
                                     <AlertDialogDescription className="text-base">
                                       Are you absolutely sure? This will permanently delete the booking record for <b>{booking.user?.name}</b>. This action cannot be undone.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter className="mt-6 gap-3">
                                     <AlertDialogCancel className="rounded-2xl h-12 font-bold px-6">No, Keep It</AlertDialogCancel>
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
        <div className="mt-4 bg-card border-none rounded-2xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
         <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl">
            <DialogHeader className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-[#1cb89e]/10 flex items-center justify-center border border-[#1cb89e]/20">
                     <img 
                        src={selectedBooking?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedBooking?.user?.name || "U")}&background=1cb89e&color=fff`} 
                        alt="Student" 
                        className="h-full w-full object-cover"
                     />
                  </div>
                  <div>
                     <DialogTitle className="text-2xl font-black">{selectedBooking?.user?.name}</DialogTitle>
                     <p className="text-sm font-bold text-muted-foreground">{selectedBooking?.user?.email}</p>
                  </div>
               </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Session Price</p>
                     <p className="text-lg font-black text-[#1cb89e]">${selectedBooking?.totalPrice}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                     <Badge className={cn(
                        "rounded-lg font-black text-[10px] uppercase tracking-widest border-none px-3 py-1",
                        selectedBooking?.status === "PENDING" && "bg-amber-500/10 text-amber-500",
                        selectedBooking?.status === "CONFIRMED" && "bg-emerald-500/10 text-emerald-500",
                        selectedBooking?.status === "CANCELLED" && "bg-rose-500/10 text-rose-500"
                     )}>
                        {selectedBooking?.status}
                     </Badge>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-start gap-3">
                     <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 mt-1">
                        <CalendarIcon className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date & Time</p>
                        <p className="font-black">{moment(selectedBooking?.startTime).format("dddd, MMMM D, YYYY")}</p>
                        <p className="text-sm font-bold text-muted-foreground">
                           {moment(selectedBooking?.startTime).format("hh:mm A")} - {moment(selectedBooking?.endTime).format("hh:mm A")}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-3">
                     <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 mt-1">
                        <Clock className="h-4 w-4" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Duration</p>
                        <p className="font-black">
                           {moment(selectedBooking?.endTime).diff(moment(selectedBooking?.startTime), 'hours')} Hour Session
                        </p>
                     </div>
                  </div>
               </div>

               <div className="pt-4 border-t border-border/50">
                  <div className="flex gap-3">
                     {selectedBooking?.status === "PENDING" && (
                        <Button 
                           className="flex-1 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-black rounded-2xl h-12 shadow-lg shadow-[#1cb89e]/20"
                           onClick={() => {
                              handleStatusChange(selectedBooking.id, "CONFIRMED");
                              setDetailsOpen(false);
                           }}
                        >
                           Confirm Session
                        </Button>
                     )}
                     <Button 
                        variant="outline" 
                        className="flex-1 rounded-2xl h-12 font-black border-2"
                        onClick={() => setDetailsOpen(false)}
                     >
                        Close
                     </Button>
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
