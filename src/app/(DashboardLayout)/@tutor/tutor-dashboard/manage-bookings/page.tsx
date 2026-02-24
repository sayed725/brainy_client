"use client";


import moment from "moment";
import { Check, Cross, MoreVertical, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
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

import { deleteBooking, getBookingsByTutorId, updateBookingStatus } from "@/actions/booking.action";
import { getTutorByUserId } from "@/actions/tutor.action";
import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Tutor {
  id: string;
  title: string;
  bio: string;
  rate: number;
  availability: boolean;
  poster: string;
  averageRating: number;
  totalBookIng: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  userId: string;

  categories?: {
    id: number;
    name: string;
    slug: string | null;
  } | null;

  timeSlots?: string[];

  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
  };
}

interface Booking {
  id: string;
  tutor?: { title: string; poster: string | null } | null;
  totalPrice: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  user: { name: string, id: string, image: string | null };
  status: string; // "PENDING" | "CONFIRMED" | "CANCELLED"
}

export default function ManageBookings() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const userId = session?.user?.id;

  const refreshTutor = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getTutorByUserId(userId);

      if (result.error) {
        throw new Error(result.error.message || "Failed to load tutor profile");
      }

      // Assuming result.data is the tutor object (adjust if different)
      setTutor(result.data.data ?? null);
    } catch (err: any) {
      const message = err.message || "Failed to load tutor information";
      setError(message);
      console.error("Error loading tutor:", err);
      // toast.error(message); // ← uncomment if you have toast
    } finally {
      setLoading(false);
    }
  };

  // Only run when userId changes (and exists)
  useEffect(() => {
    if (userId) {
      refreshTutor();
    } else {
      setLoading(false);
      setTutor(null);
    }
  }, [userId]);

  const refreshBookings = async () => {
    if (!userId) return;

    //   setLoading(true);
    //   setError(null);

    try {
      const result = await getBookingsByTutorId(tutor?.id as string);
      if (result.error) {
        throw new Error(result.error.message || "Failed to load bookings");
      }
      setBookings(result.data?.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to refresh bookings");
      toast.error("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (tutor?.id) {
      refreshBookings();
    }
  }, [tutor?.id]);

//   console.log("Tutor data:", tutor?.id);
//   console.log("Bookings data:", bookings);

// Status change handler
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
    await toast.promise(
      updateBookingStatus(bookingId, newStatus),
      {
        loading: `${actionVerb} booking...`,
        success: <b>Booking successfully {pastVerb}!</b>,
        error: (err) => <b>{err.message || `Failed to update booking status`}</b>,
      }
    );

    await refreshBookings();

  } catch (err) {
    // console.error(err);
    // toast.promise already handled error toast
    await refreshBookings(); // keep UI in sync
  }
};

const handleDelete = async (bookingId: string) => {
  try {
    await toast.promise(
      deleteBooking(bookingId),
      {
        loading: "Deleting booking...",
        success: <b>Booking successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete booking"}</b>,
      }
    );
    
    await refreshBookings();
  } catch (error) {
    // toast.promise already showed the error toast
    await refreshBookings(); // keep UI in sync even on failure
  }
};





  // ────────────────────────────────────────────────
  // Loading / error / no tutor states
  // ────────────────────────────────────────────────

  if (isSessionLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tutor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-destructive mb-2">
            Error
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={refreshTutor}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No Tutor Profile Found
          </h2>
          <p className="text-muted-foreground mb-6">
            It looks like you haven't created a tutor profile yet.
          </p>
          {/* Add link/button to create tutor profile */}
          <a
            href="/tutor/setup"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Create Tutor Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 lg:px-6 pb-16">
      <DashboardPagesHeader
        title={"Manage Booking Requests"}
        subtitle={"Review and respond to student booking requests"}
        icon={User}
      />

      <div className="mt-6 overflow-hidden bg-card">
        <Table>
          <TableCaption>
            {bookings.length === 0
              ? "No bookings found"
            
                : "Your bookings"}
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="text-xs">Image</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Price</TableHead>
              <TableHead className="text-xs">Start Time</TableHead>
              <TableHead className="text-xs">End Time</TableHead>
              <TableHead className="text-xs">Created</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-center text-xs pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 9 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="bg-muted animate-pulse h-8 rounded"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : bookings?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-48 text-center text-muted-foreground"
                >
                  No booking requests found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking, index) => {
               
                return (
                  <TableRow key={booking.id} className="hover:bg-muted/40">
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden border bg-muted">
                        <img
                          src={booking.user.image?? "/default-tutor.jpg"}
                          alt={booking.user?.name ?? "user"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="font-medium max-w-60 truncate">
                      {booking.user.name || "—"}
                    </TableCell>

                    <TableCell className="font-medium">
                      {booking.totalPrice > 0 ? `$${booking.totalPrice}` : "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {booking.startTime
                        ? moment(booking.startTime).format(
                            "MMM D, YYYY • h:mm A",
                          )
                        : "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {booking.endTime
                        ? moment(booking.endTime).format("MMM D, YYYY • h:mm A")
                        : "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm">
                      {booking.createdAt
                        ? moment(booking.createdAt).fromNow()
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            booking.status === "PENDING"
                              ? "bg-yellow-500"
                              : booking.status === "CONFIRMED"
                                ? "bg-green-600"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="capitalize text-sm font-medium">
                          {booking.status?.toLowerCase() || "unknown"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="bg-base-200 p-2 mx-0 rounded border border-border w-fit ">
                            <MoreVertical className="cursor-pointer text-gray-700 dark:text-white" />
                          </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {booking.status === "PENDING" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking.id, "CANCELLED")
                              }
                              className="text-green-700 cursor-pointer dark:text-green-500"
                            >
                              <Check className="mr-2 h-4 w-4 dark:text-white" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}

                          {booking.status === "CANCELLED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking.id, "PENDING")
                              }
                              className="text-yellow-500 cursor-pointer dark:text-yellow-500"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Make Pending
                            </DropdownMenuItem>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The booking will
                                  be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(booking.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
