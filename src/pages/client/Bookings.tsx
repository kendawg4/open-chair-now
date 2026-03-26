import { BottomNav } from "@/components/BottomNav";
import { useMyBookings, useUpdateBookingStatus } from "@/hooks/use-data";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-700",
  confirmed: "bg-green-500/15 text-green-700",
  completed: "bg-primary/15 text-primary",
  cancelled: "bg-muted text-muted-foreground",
  declined: "bg-destructive/15 text-destructive",
  no_show: "bg-destructive/15 text-destructive",
};

export default function ClientBookings() {
  const { data: bookings, isLoading } = useMyBookings("client");
  const updateStatus = useUpdateBookingStatus();

  const pending = bookings?.filter((b: any) => b.status === "pending") || [];
  const confirmed = bookings?.filter((b: any) => b.status === "confirmed") || [];
  const completed = bookings?.filter((b: any) => b.status === "completed") || [];
  const other = bookings?.filter((b: any) => ["cancelled", "declined", "no_show"].includes(b.status)) || [];

  const handleCancel = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "cancelled" });
      toast.success("Booking cancelled");
    } catch { toast.error("Failed to cancel"); }
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const proName = booking.professional_profiles?.profiles?.full_name || "Professional";
    return (
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {booking.professional_profiles?.profiles?.avatar_url ? (
                <img src={booking.professional_profiles.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary">{proName.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{proName}</p>
              <p className="text-xs text-muted-foreground">{booking.services?.service_name || "Service"}</p>
            </div>
          </div>
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide", statusColors[booking.status] || "bg-muted text-muted-foreground")}>
            {String(booking.status).replace("_", " ")}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{booking.booking_date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.start_time}</span>
          {booking.total_price_estimate && <span className="font-medium text-foreground">${Number(booking.total_price_estimate)}</span>}
        </div>
        {booking.notes && <p className="text-xs text-muted-foreground">{booking.notes}</p>}
        {booking.status === "pending" && (
          <Button variant="outline" size="sm" className="rounded-full text-xs mt-1" onClick={() => handleCancel(booking.id)} disabled={updateStatus.isPending}>
            Cancel Request
          </Button>
        )}
      </div>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/profile"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">My Bookings</h1>
        </div>
      </header>

      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="upcoming">Upcoming ({pending.length + confirmed.length})</TabsTrigger>
              <TabsTrigger value="completed">Done ({completed.length})</TabsTrigger>
              <TabsTrigger value="other">Other ({other.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-3">
              {[...pending, ...confirmed].length === 0 ? <EmptyState message="No upcoming bookings" /> :
                [...pending, ...confirmed].map((b: any) => <BookingCard key={b.id} booking={b} />)}
            </TabsContent>
            <TabsContent value="completed" className="space-y-3">
              {completed.length === 0 ? <EmptyState message="No completed bookings yet" /> :
                completed.map((b: any) => <BookingCard key={b.id} booking={b} />)}
            </TabsContent>
            <TabsContent value="other" className="space-y-3">
              {other.length === 0 ? <EmptyState message="No cancelled or declined bookings" /> :
                other.map((b: any) => <BookingCard key={b.id} booking={b} />)}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
