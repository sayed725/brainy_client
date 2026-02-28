"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { Tutor } from "@/app/(CommonLayout)/tutors/[id]/page";
import { authClient } from "@/lib/auth-client";
import { addBooking } from "@/actions/booking.action";


// Time slot mapping (unchanged)
const timeSlotInfo = {
  MORNING: {
    label: "Morning",
    timeRange: "8:00 AM - 12:00 PM",
    description: "Ideal for early learners or school/college students",
  },
  AFTERNOON: {
    label: "Afternoon",
    timeRange: "12:00 PM - 5:00 PM",
    description: "Good for working professionals or afternoon study sessions",
  },
  EVENING: {
    label: "Evening",
    timeRange: "5:00 PM - 9:00 PM",
    description: "Popular for after-work or after-school classes",
  },
  NIGHT: {
    label: "Night",
    timeRange: "9:00 PM - 12:00 AM",
    description: "Suitable for night owls or late-night learners",
  },
} as const;

type TimeSlotKey = keyof typeof timeSlotInfo;

interface TutorBookingProps {
  tutor: Tutor;
}

export function TutorBooking({ tutor }: TutorBookingProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotKey | null>(null);
    const { data: session, isPending, refetch } = authClient.useSession();
  const [booked, setBooked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = session?.user;

  // console.log("TutorBooking Props:", { tutor, session, isPending });


  //  useEffect(() => {
  //   async function load() {
  //     const { data, error } = await getBookings(user?.id! as string);
  //       console.log("User Bookings:", data, "Error:", error);
  //   }
  //   load();
  // }, []);

  



  // console.log("Current User:", user);
  // Modal form state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Calculate number of days (inclusive) and total price
  const calculatePrice = () => {
    if (!startDate || !endDate || endDate < startDate) return 0;

    // differenceInCalendarDays counts full days between dates (end - start)
    // Add 1 to make it inclusive (same day = 1 day)
    const days = differenceInCalendarDays(endDate, startDate) + 1;

    if (days <= 0) return 0;

    // Each day = 4 hours × rate
    return days * 4 * tutor.rate;
  };

  const totalPrice = calculatePrice();

  function handleBook() {
    if (!selectedSlot) return;
    setIsModalOpen(true);
  }

async function confirmBooking() {
  // ── Validation ────────────────────────────────────────────────
  if (!startDate || !endDate) {
    toast.error("Please select both start and end dates");
    return;
  }

  if (endDate < startDate) {
    toast.error("End date must be on or after start date");
    return;
  }

  if (totalPrice <= 0) {
    toast.error("Booking must cover at least 1 day");
    return;
  }

  if(!user?.uniqueStatus){
    toast.error("You account currently freeze by admin , please contact admin")
  }

  const toastId = toast.loading("Sending booking request...");

  // ── Prepare payload ───────────────────────────────────────────
  const bookingData = {
   startTime: startDate.toISOString(),
    endTime:   endDate.toISOString(),
    totalPrice,
    tutorId: tutor.id,
    userId: user?.id,
  };

  // console.log("Sending to API:", bookingData);
  
  try {
    const res = await addBooking(bookingData);

    // console.log("API Response:", res);

    
  

    // Handle API response styles (adjust according to your actual API)
   if (res && 'error' in res && res.error) {
      toast.error(res.error.message || "Booking failed", { id: toastId });
      return;
    }

    // ── Success path ─────────────────────────────────────────────
    toast.dismiss(toastId);               // remove loading
    toast.success("Booking request sent successfully!");

    setBooked(true);
    setIsModalOpen(false);

    // Reset form
    setStartDate(undefined);
    setEndDate(undefined);

    // Optional: navigate, refresh data, etc.
    // navigate("/bookings");  // ← uncomment if desired
    // await refetchTutor();    // if using react-query / swr

  } catch (err: any) {
    // ── Error path ───────────────────────────────────────────────
    const message =
      err.message ||
      err?.response?.data?.message ||
      "Something went wrong. Please try again.";

    toast.error(message, { id: toastId });
    // loading toast is automatically replaced by error toast
  }
}

  if (booked) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          Booking Confirmed!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You booked <span className="font-medium text-foreground">{tutor.user.name}</span> for{" "}
          <span className="font-medium text-foreground">
            {timeSlotInfo[selectedSlot!]?.label || selectedSlot}
          </span>
          .
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          A confirmation will be sent to your email.
        </p>
        {/* <Button
          variant="outline"
          className="mt-6 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
          onClick={() => {
            setBooked(false);
            setSelectedSlot(null);
          }}
        >
          Book Another Slot
        </Button> */}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-base font-semibold text-foreground">
          Available Time Slots
        </h3>
      </div>

      {tutor.timeSlots?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tutor.timeSlots.map((slot: string) => {
            const info = timeSlotInfo[slot as TimeSlotKey];
            const isSelected = selectedSlot === slot;

            return (
              <button
                key={slot}
                onClick={() =>
                  setSelectedSlot(slot === selectedSlot ? null : (slot as TimeSlotKey))
                }
                title={info?.description}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-[#1cb89e] bg-[#1cb89e] text-white"
                    : "border-border bg-background text-foreground hover:border-[#1cb89e]/40 hover:bg-[#1cb89e]/5"
                }`}
              >
                {info?.label || slot}
                {info?.timeRange && (
                  <span className="ml-1.5 text-xs opacity-75">
                    ({info.timeRange})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No time slots available at the moment.
        </p>
      )}

      <Button
        onClick={handleBook}
        disabled={!selectedSlot || !tutor.availability}
        className="mt-6 w-full bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
        size="lg"
      >
        {!tutor.availability
          ? "Tutor Unavailable"
          : selectedSlot
            ? `Book for ${timeSlotInfo[selectedSlot]?.label || selectedSlot}`
            : "Select a time slot to book"}
      </Button>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Session with {tutor.user.name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Start Date */}
            <div className="grid gap-2">
              <Label>Select Start Date</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </div>

            {/* End Date */}
            <div className="grid gap-2">
              <Label>Select End Date</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                initialFocus
              />
            </div>

            {/* Price Calculation - day-based (4 hours per day) */}
            {startDate && endDate && (
              <div className="text-sm font-medium text-center mt-2">
                Estimated Price:{" "}
                <span className="text-[#1cb89e] font-semibold">${totalPrice}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({differenceInCalendarDays(endDate, startDate) + 1} day(s) × 4 hours × ${tutor.rate}/hr)
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={confirmBooking}
              disabled={!startDate || !endDate || totalPrice <= 0}
              className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
            >
              Confirm Booking ${totalPrice}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}