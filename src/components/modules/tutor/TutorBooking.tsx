"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/app/(CommonLayout)/tutors/[id]/page";

// Time slot mapping with labels, ranges, and descriptions
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
  const [booked, setBooked] = useState(false);

  function handleBook() {
    if (!selectedSlot) return;
    setBooked(true);
    // In real app: call booking API here
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
          {" "}
          <span className="text-xs text-muted-foreground">
            ({timeSlotInfo[selectedSlot!]?.timeRange || "N/A"})
          </span>.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          A confirmation will be sent to your email.
        </p>
        <Button
          variant="outline"
          className="mt-6 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white"
          onClick={() => {
            setBooked(false);
            setSelectedSlot(null);
          }}
        >
          Book Another Slot
        </Button>
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
                title={info?.description} // tooltip on hover
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
    </div>
  );
}