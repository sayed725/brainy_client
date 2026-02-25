"use client";

import moment from "moment";
import { Check, MoreVertical, Trash } from "lucide-react";
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

import {
  deleteBooking,
  getAllBookings,
  updateBookingStatus,
} from "@/actions/booking.action";

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VscRequestChanges } from "react-icons/vsc";
import { Booking } from "@/constants/otherinterface";



export default function ManageBookings() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const userId = session?.user?.id;

  const refreshBookings = async () => {
    if (!userId) return;

    //   setLoading(true);
    //   setError(null);

    try {
      const result = await getAllBookings();
      if (result.error) {
        throw new Error(result.error.message || "Failed to load bookings");
      }
      setBookings(result.data?.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to refresh bookings");
      //  toast.error("Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (userId) {
      refreshBookings();
    }
  }, [userId]);

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
      await toast.promise(updateBookingStatus(bookingId, newStatus), {
        loading: `${actionVerb} booking...`,
        success: <b>Booking successfully {pastVerb}!</b>,
        error: (err) => (
          <b>{err.message || `Failed to update booking status`}</b>
        ),
      });

      await refreshBookings();
    } catch (err) {
      // console.error(err);

      await refreshBookings();
    }
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await toast.promise(deleteBooking(bookingId), {
        loading: "Deleting booking...",
        success: <b>Booking successfully deleted!</b>,
        error: (err) => <b>{err.message || "Failed to delete booking"}</b>,
      });

      await refreshBookings();
    } catch (error) {
      await refreshBookings();
    }
  };

  return (
    <div className="px-0 lg:px-6 pb-16">
      <DashboardPagesHeader
        title={"Manage Booking Requests"}
        subtitle={"Review and respond to student booking requests"}
        icon={VscRequestChanges}
      />

      <div className="mt-6 overflow-hidden bg-card">
        <Table>
          <TableCaption>
            {bookings.length === 0
              ? "No booking requests found"
              : "Your bookings booking request."}
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="text-xs">Image</TableHead>
              <TableHead className="text-xs">User Name</TableHead>
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
                          src={booking.user.image ?? "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=128"}
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
                                handleStatusChange(booking.id, "CONFIRMED")
                              }
                              className="text-green-700 cursor-pointer dark:text-green-500"
                            >
                              <Check className="mr-2 h-4 w-4 dark:text-white" />
                              Confirm Booking
                            </DropdownMenuItem>
                          )}

                          {booking.status === "CONFIRMED" && (
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
