// app/admin/manage-bookings/page.tsx
"use client";

import moment from "moment";
import { 
  Check, 
  MoreVertical, 
  Trash, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  Eye,
  CheckCircle2,
  XCircle,
  User,
  GraduationCap,
  ShieldCheck,
  DollarSign
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { 
  useAllBookings, 
  useUpdateBookingStatus, 
  useDeleteBooking,
  extractData 
} from "@/hooks/useBookings";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VscRequestChanges } from "react-icons/vsc";
import { Booking } from "@/constants/otherinterface";
import { cn } from "@/lib/utils";
import USPagination from "@/components/shared/USPagination";

export default function ManageBookings() {
  // Filtering and Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Bookings with Query Params
  const { data: response, isLoading: loading, error: queryError } = useAllBookings({
    searchTerm: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sort: sortBy,
    order: sortOrder,
    page,
    limit: 10
  });

  const updateBookingStatusMutation = useUpdateBookingStatus();
  const deleteBookingMutation = useDeleteBooking();

  const bookings = extractData(response) as Booking[];
  const meta = (response as any)?.meta || (response as any)?.data?.meta;

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
        error: (err) => <b>{err.message || `Failed to update status`}</b>,
      });
    } catch (err) {}
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;
    try {
      await toast.promise(deleteBookingMutation.mutateAsync(selectedBooking.id), {
        loading: "Removing booking record...",
        success: <b>Booking successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete booking"}</b>,
      });
      setIsDeleteOpen(false);
      setSelectedBooking(null);
    } catch (error) {}
  };

  const isFiltered = searchQuery !== "" || statusFilter !== "all" || sortBy !== "createdAt" || sortOrder !== "desc";

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <div className="pb-10 max-w-screen-2xl mx-auto space-y-4">
      <DashboardPagesHeader
        title="Booking Management"
        subtitle="Monitor and moderate platform-wide session requests"
        icon={VscRequestChanges}
      />

      {/* Toolbar */}
      <div className="flex flex-row gap-2 sm:gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
          <Input
            placeholder="Search student or tutor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-card border-none shadow-sm rounded-xl focus-visible:ring-[#1cb89e]/30 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="hidden lg:flex h-10 min-w-[140px] bg-card border-none shadow-sm rounded-xl text-xs font-black px-4 focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                 <Filter className="w-3 h-3" />
                 <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
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
            className="h-10 px-6 rounded-xl bg-card border-none shadow-sm hover:bg-muted font-bold text-xs disabled:opacity-50 transition-all active:scale-95"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-20 font-black text-[10px] uppercase tracking-widest pl-8 text-muted-foreground text-center">#</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Student</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Session Service</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Total</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Schedule</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Joined</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-8 text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-border/30">
                    <TableCell colSpan={6} className="p-4">
                      <div className="h-12 bg-muted/40 rounded-xl w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                      <CalendarIcon className="w-12 h-12" />
                      <p className="font-black text-xs uppercase tracking-widest">No bookings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking, index) => (
                  <TableRow key={booking.id} className="group border-border/30 hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-8 text-center">
                      <span className="font-mono text-[10px] font-black text-muted-foreground opacity-50">
                        {((page - 1) * 10 + index + 1).toString().padStart(2, "0")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-[#1cb89e]/10 border border-[#1cb89e]/20 overflow-hidden flex items-center justify-center">
                          <img 
                            src={booking.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || "U")}&background=1cb89e&color=fff`} 
                            alt="Student" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-foreground line-clamp-1">{booking.user?.name || "Student"}</span>
                          <span className="text-[10px] font-bold text-muted-foreground opacity-60 tracking-tight lowercase">{booking.user?.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground line-clamp-1">{booking.tutor?.title || "Mentorship Session"}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-black uppercase text-muted-foreground opacity-40">Service ID: #{booking.tutorId?.slice(-4)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="font-black text-sm text-[#1cb89e]">${booking.totalPrice}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                          <CalendarIcon className="h-3 w-3 text-[#1cb89e]" />
                          {moment(booking.startTime).format("MMM D, YYYY")}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black opacity-60">
                          <Clock className="h-3 w-3" />
                          {moment(booking.startTime).format("hh:mm A")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-foreground">{moment(booking.createdAt).format("MMM D, YYYY")}</span>
                          <span className="text-[10px] font-bold text-muted-foreground opacity-60 lowercase tracking-tight">{moment(booking.createdAt).fromNow()}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-xl font-bold text-[10px] uppercase tracking-[0.05em] px-3 py-1 border transition-colors",
                          booking.status === "PENDING" && "bg-amber-50 text-amber-600 border-amber-100",
                          booking.status === "CONFIRMED" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                          booking.status === "CANCELLED" && "bg-rose-50 text-rose-600 border-rose-100"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted transition-all">
                            <MoreVertical className="h-4.5 w-4.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setDetailsOpen(true);
                            }}
                            className="rounded-lg font-black text-[10px] uppercase tracking-widest p-3 cursor-pointer focus:bg-[#1cb89e]/10 focus:text-[#1cb89e]"
                          >
                            <Eye className="mr-2 h-4 w-4" /> Inspect Session
                          </DropdownMenuItem>
                          
                          {booking.status === "PENDING" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                              className="rounded-lg font-black text-[10px] uppercase tracking-widest p-3 cursor-pointer text-emerald-600 focus:bg-emerald-600 focus:text-white"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
                            </DropdownMenuItem>
                          )}

                          {booking.status !== "CANCELLED" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                              className="rounded-lg font-black text-[10px] uppercase tracking-widest p-3 cursor-pointer text-rose-600 focus:bg-rose-600 focus:text-white"
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Cancel
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDeleteOpen(true);
                            }}
                            className="rounded-lg font-black text-[10px] uppercase tracking-widest p-3 cursor-pointer text-rose-600 focus:bg-rose-600 focus:text-white"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Terminate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="mt-4 border-none rounded-xl overflow-hidden shadow-sm">
          <USPagination 
            page={page} 
            totalPage={meta.totalPage} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {/* Inspect Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-xl border border-border/50 shadow-md p-0 overflow-hidden bg-card">
          <DialogHeader className="sr-only">
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>Full overview of the selected booking session</DialogDescription>
          </DialogHeader>
          <div className="h-32 bg-gradient-to-br from-[#1cb89e] to-[#128c78] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          
          <div className="px-4 sm:px-8 pb-8 sm:pb-10 -mt-12 sm:-mt-16 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl overflow-hidden border-4 sm:border-8 border-card shadow-xl bg-muted mb-4 sm:mb-6">
                <img
                  src={selectedBooking?.user?.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedBooking?.user?.name || "U")}&background=1cb89e&color=fff&size=256`}
                  alt={selectedBooking?.user?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <h2 className="text-xl font-black text-foreground mb-1">{selectedBooking?.user?.name || "Student"}</h2>
              <p className="text-xs font-bold text-muted-foreground mb-6 opacity-60 tracking-tight lowercase">{selectedBooking?.user?.email}</p>
              
              <div className="flex gap-2 mb-8">
                <Badge variant="outline" className={cn(
                  "rounded-xl font-bold text-[10px] uppercase tracking-[0.05em] px-3 py-1 border transition-colors",
                  selectedBooking?.status === "PENDING" && "bg-amber-50 text-amber-600 border-amber-100",
                  selectedBooking?.status === "CONFIRMED" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                  selectedBooking?.status === "CANCELLED" && "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {selectedBooking?.status}
                </Badge>
                <Badge variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-1.5 border-none bg-muted shadow-sm">
                  ${selectedBooking?.totalPrice} Paid
                </Badge>
              </div>
              
              <div className="w-full space-y-3 text-left">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-[#1cb89e]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course Service</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground max-w-[150px] truncate">
                    {selectedBooking?.tutor?.title || "Session"}
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#1cb89e]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Date</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                    {moment(selectedBooking?.startTime).format("MMM DD, YYYY")}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#1cb89e]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Slot</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                    {moment(selectedBooking?.startTime).format("hh:mm A")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-4 bg-muted/10 border-t border-border/50">
            <Button onClick={() => setDetailsOpen(false)} className="w-full h-10 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#1cb89e]/10 transition-all active:scale-95">
              Close Overview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-xl border border-border/50 shadow-sm p-5 sm:p-8 bg-card text-center">
          <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
            <Trash className="w-8 h-8" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-black text-foreground">Terminate Booking?</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-sm">
              Are you sure you want to delete this session record? This action is permanent and will remove the booking for <b>{selectedBooking?.user?.name}</b>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/50 bg-muted/30 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteBookingMutation.isPending}
              className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm transition-all active:scale-95"
            >
              {deleteBookingMutation.isPending ? "Removing..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}