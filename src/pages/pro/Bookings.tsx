import { BottomNav } from "@/components/BottomNav";
import { useMyBookings } from "@/hooks/use-data";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProBookings() {
  const { data: bookings, isLoading } = useMyBookings("pro");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Bookings</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display font-semibold text-sm">No bookings yet</p>
            <p className="mt-1 text-xs text-muted-foreground">New requests and confirmed appointments will show up here.</p>
          </div>
        ) : (
          bookings.map((booking: any) => (
            <div key={booking.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{booking.profiles?.full_name || "Client"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {booking.services?.service_name || "Service"} · {booking.booking_date} · {booking.start_time}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
                  {String(booking.status).replace("_", " ")}
                </span>
              </div>
              {booking.notes && <p className="mt-2 text-xs text-muted-foreground">{booking.notes}</p>}
            </div>
          ))
        )}
      </div>

      <BottomNav role="pro" />
    </div>
  );
}