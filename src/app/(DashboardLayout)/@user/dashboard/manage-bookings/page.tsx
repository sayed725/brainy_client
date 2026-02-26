"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { MdOutlineRateReview } from "react-icons/md";
import { Check, MoreVertical, Trash, Star } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

import DashboardPagesHeader from "@/components/shared/DashboardPagesHeader";
import { authClient } from "@/lib/auth-client";
import {
  updateBookingStatus,
  deleteBooking,
  getAllBookings,
  // createReview, // ← you'll add this action
} from "@/actions/booking.action";

import { VscRequestChanges } from "react-icons/vsc";
import { Booking } from "@/constants/otherinterface";
import { addReview } from "@/actions/review.action";

export default function ManageBookings() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userId = session?.user?.id;

  const refreshBookings = async () => {
    if (!userId) return;

    try {
      const result = await getAllBookings();
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

  useEffect(() => {
    if (userId) {
      refreshBookings();
    }
  }, [userId]);

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

    // console.log("Review Data:", reviewData); // Debug log to check review data before submission

    try {
      await toast.promise(
        addReview(reviewData), // ← your new server action
        // createReview(reviewData),  // ← your new server action

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
      // await refreshBookings(); // optional - if you want to show updated status
    } catch (err) {
      // toast.promise already handles error
    }
  };

  return (
    <div className="px-0 lg:px-6 pb-16">
      <DashboardPagesHeader
        title={"My Bookings"}
        subtitle={"View and manage your tutoring sessions"}
        icon={VscRequestChanges}
      />

      <div className="mt-6 overflow-hidden bg-card">
        <Table>
          <TableCaption>
            {bookings.length === 0 ? "No bookings found" : "Your bookings"}
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="text-xs">Image</TableHead>
              <TableHead className="text-xs">Course Title</TableHead>
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
                      <div className="bg-muted animate-pulse h-8 rounded" />
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
              bookings.map((booking, index) => (
                <TableRow key={booking.id} className="hover:bg-muted/40">
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden border bg-muted">
                      <img
                        src={booking.tutor?.poster ?? "/default-tutor.jpg"}
                        alt={booking.tutor?.title ?? "Tutor"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="font-medium max-w-60 truncate">
                    {booking.tutor?.title || "—"}
                  </TableCell>

                  <TableCell className="font-medium">
                    {booking.totalPrice > 0 ? `$${booking.totalPrice}` : "—"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {booking.startTime
                      ? moment(booking.startTime).format("MMM D, YYYY • h:mm A")
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
                        <div className="bg-base-200 p-2 mx-0 rounded border border-border w-fit">
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

                        {booking.status === "CONFIRMED" && (
                          <DropdownMenuItem
                            onClick={() => openReviewDialog(booking)}
                            className="cursor-pointer text-black dark:text-white"
                          >
                            <MdOutlineRateReview className="mr-2 h-4 w-4" />
                            Give Review
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
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with{" "}
              {selectedBooking?.tutor?.title || "the tutor"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the session..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={rating === 0}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
