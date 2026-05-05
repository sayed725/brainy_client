"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format, differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";
import { Tutor } from "@/app/(CommonLayout)/tutors/[id]/page";
import { authClient } from "@/lib/auth-client";
import { useCreateBooking, useUserBookings } from "@/hooks/useBookings";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";


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
  
  const { data: userBookings = [] } = useUserBookings(user?.id);
  const hasAlreadyBooked = userBookings.some((b) => b.tutorId === tutor.id);

  const createBookingMutation = useCreateBooking();

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
    await createBookingMutation.mutateAsync(bookingData);
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

  if (isPending) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1cb89e] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <div className="mx-auto w-16 h-16 bg-[#1cb89e]/10 rounded-full flex items-center justify-center mb-4">
          <CalendarDays className="h-8 w-8 text-[#1cb89e]" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Sign in to Book a Session</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
          Start your learning journey with {tutor.user.name} by logging into your account.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="w-full sm:w-auto bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white px-8">
            <Link href="/login">Login to Book</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (hasAlreadyBooked && !booked) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#1cb89e]/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-[#1cb89e]" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Tutor Already Booked
        </h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          You have already secured a booking with <span className="font-semibold text-foreground">{tutor.user.name}</span>. 
          Check your dashboard for details or try exploring other expert tutors!
        </p>
        <div className="mt-8 space-y-3">
          <Button asChild className="w-full bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white font-bold h-12 shadow-md">
             <Link href="/tutors">Find More Tutors</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12">
             <Link href="/dashboard">View My Bookings</Link>
          </Button>
        </div>
      </div>
    );
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
        <DialogContent className="max-w-[95vw] lg:max-w-4xl xl:max-w-5xl w-full p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
            
            {/* Left Side: Calendars */}
            <div className="flex-1 p-6 md:p-10 bg-background">
              <DialogHeader className="mb-8 text-center md:text-left">
                <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
                  <CalendarDays className="h-7 w-7 text-[#1cb89e]" />
                  Select Your Dates
                </DialogTitle>
                <DialogDescription className="text-base mt-2">
                  Choose the duration for your mentorship with {tutor.user.name}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10 justify-items-center">
                <div className="space-y-4 w-full max-w-[320px]">
                  <Label className="text-sm font-bold text-foreground ml-1">Start Date</Label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-2xl border border-border shadow-sm p-4 w-full bg-card"
                  />
                </div>
                <div className="space-y-4 w-full max-w-[320px]">
                  <Label className="text-sm font-bold text-foreground ml-1">End Date</Label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    className="rounded-2xl border border-border shadow-sm p-4 w-full bg-card"
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Summary */}
            <div className="w-full md:w-80 xl:w-96 bg-slate-50 dark:bg-slate-900/50 p-6 md:p-10 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-foreground">Booking Summary</h4>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-background border border-border space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="font-bold">${tutor.rate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Session</span>
                      <span className="font-bold text-[#1cb89e]">{timeSlotInfo[selectedSlot!]?.label || selectedSlot}</span>
                    </div>
                    <Separator className="opacity-50" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Days</span>
                      <span className="font-bold">{startDate && endDate ? differenceInCalendarDays(endDate, startDate) + 1 : 0} Day(s)</span>
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="p-4 rounded-xl bg-[#1cb89e]/5 border border-[#1cb89e]/20 space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Price</p>
                      <div className="text-3xl font-black text-[#1cb89e]">${totalPrice}</div>
                      <p className="text-[10px] text-muted-foreground italic">Inclusive of all platform fees</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mt-8">
                <Button
                  onClick={confirmBooking}
                  disabled={!startDate || !endDate || totalPrice <= 0}
                  className="w-full bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white h-12 text-base font-bold shadow-lg shadow-[#1cb89e]/20 transition-all active:scale-95"
                >
                  Confirm & Pay
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}