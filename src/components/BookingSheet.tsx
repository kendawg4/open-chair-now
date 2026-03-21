import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ServiceOption {
  id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
  instant_book?: boolean | null;
}

interface BookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proProfileId: string;
  proName: string;
  services: ServiceOption[];
}

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM",
];

export function BookingSheet({ open, onOpenChange, proProfileId, proName, services }: BookingSheetProps) {
  const { profile } = useAuth();
  const createBooking = useCreateBooking();
  const [step, setStep] = useState<"service" | "datetime" | "confirm" | "done">("service");
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setStep("service");
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setNotes("");
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const convertTo24h = (time12: string) => {
    const [time, mod] = time12.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (mod === "PM" && h !== 12) h += 12;
    if (mod === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!profile || !selectedService || !selectedDate || !selectedTime) return;
    try {
      await createBooking.mutateAsync({
        client_profile_id: profile.id,
        professional_profile_id: proProfileId,
        service_id: selectedService.id,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: convertTo24h(selectedTime),
        notes: notes || undefined,
        total_price_estimate: selectedService.price,
      });
      setStep("done");
      toast.success("Booking request sent!");
    } catch (e: any) {
      toast.error(e.message || "Failed to create booking");
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">
            {step === "done" ? "Request Sent!" : `Book with ${proName}`}
          </SheetTitle>
        </SheetHeader>

        {step === "done" && (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <p className="font-display font-bold text-lg">You're all set!</p>
            <p className="text-sm text-muted-foreground">
              Your request for <span className="font-medium text-foreground">{selectedService?.service_name}</span> on{" "}
              <span className="font-medium text-foreground">{selectedDate && format(selectedDate, "MMM d")}</span> at{" "}
              <span className="font-medium text-foreground">{selectedTime}</span> has been sent.
            </p>
            <p className="text-xs text-muted-foreground">You'll be notified when {proName} responds.</p>
            <Button className="rounded-full mt-4" onClick={() => handleClose(false)}>Done</Button>
          </div>
        )}

        {step === "service" && (
          <div className="space-y-3 pt-4">
            <Label className="text-sm font-medium">Select a service</Label>
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services available</p>
            ) : (
              services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep("datetime"); }}
                  className={cn(
                    "w-full text-left rounded-xl border border-border bg-card p-4 transition-all",
                    selectedService?.id === s.id ? "ring-2 ring-primary" : "hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{s.service_name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{s.duration_minutes} min</span>
                        {s.instant_book && <span className="text-primary font-medium">⚡ Instant</span>}
                      </div>
                    </div>
                    <p className="font-display font-bold">${Number(s.price)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {selectedService?.service_name} · ${Number(selectedService?.price)}
              </Label>
              <button onClick={() => setStep("service")} className="text-xs text-primary font-medium">Change</button>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Pick a date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left", !selectedDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Pick a time</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                      selectedTime === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Notes (optional)</Label>
              <Textarea
                placeholder="Any special requests or preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <Button
              className="w-full rounded-full"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep("confirm")}
            >
              Review Request
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 pt-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="text-sm font-medium">{selectedService?.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium">{selectedDate && format(selectedDate, "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium">{selectedService?.duration_minutes} min</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-sm font-semibold">Estimated Total</span>
                <span className="font-display font-bold">${Number(selectedService?.price)}</span>
              </div>
              {notes && (
                <div className="border-t border-border pt-2 mt-2">
                  <span className="text-xs text-muted-foreground">Note: </span>
                  <span className="text-xs">{notes}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep("datetime")}>Back</Button>
              <Button
                className="flex-1 rounded-full"
                onClick={handleSubmit}
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
