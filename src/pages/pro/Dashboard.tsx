import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProfessionals } from "@/data/mock";
import { AvailabilityStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Users, Calendar, Star, Bell, ChevronRight, Clock, TrendingUp } from "lucide-react";

const statuses: { value: AvailabilityStatus; emoji: string }[] = [
  { value: "open-chair", emoji: "🪑" },
  { value: "available-now", emoji: "⚡" },
  { value: "last-minute", emoji: "🔥" },
  { value: "appointment-only", emoji: "📅" },
  { value: "busy", emoji: "🚫" },
  { value: "offline", emoji: "💤" },
];

export default function ProDashboard() {
  const pro = mockProfessionals[0];
  const [status, setStatus] = useState<AvailabilityStatus>(pro.status);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={pro.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-display font-bold text-sm">{pro.name}</p>
              <StatusBadge status={status} size="sm" />
            </div>
          </div>
          <button className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-status-busy border-2 border-card" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-6">
        {/* Status Toggle */}
        <section className="rounded-2xl bg-card border border-border p-4">
          <h2 className="font-display font-bold text-base mb-3">Your status</h2>
          <div className="grid grid-cols-3 gap-2">
            {statuses.map(s => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                  status === s.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/30"
                )}
              >
                <span className="text-lg">{s.emoji}</span>
                <StatusBadge status={s.value} size="sm" />
              </button>
            ))}
          </div>
          {["open-chair", "available-now", "last-minute"].includes(status) && (
            <div className="mt-3 rounded-xl bg-primary/10 border border-primary/20 p-3">
              <p className="text-xs text-primary font-medium">✅ You're visible to nearby clients! Add a promo or time window to attract more bookings.</p>
              <Button size="sm" variant="outline" className="mt-2 h-7 text-xs rounded-full">
                + Add promo or note
              </Button>
            </div>
          )}
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Today's overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Eye, label: "Profile views", value: "47", change: "+12%" },
              { icon: Users, label: "Followers", value: "1,820", change: "+3" },
              { icon: Calendar, label: "Bookings today", value: "6", change: "2 pending" },
              { icon: Star, label: "Avg. rating", value: "4.9", change: "234 reviews" },
            ].map(({ icon: Icon, label, value, change }) => (
              <div key={label} className="rounded-xl bg-card border border-border p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="font-display font-bold text-xl">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-[10px] text-primary font-medium mt-0.5">{change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming bookings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">Upcoming bookings</h2>
            <button className="flex items-center gap-0.5 text-xs text-primary font-medium">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { time: "2:30 PM", name: "James T.", service: "Skin Fade", duration: "35 min", status: "confirmed" },
              { time: "3:15 PM", name: "Destiny R.", service: "Haircut + Beard", duration: "45 min", status: "confirmed" },
              { time: "4:00 PM", name: "Open Slot", service: "", duration: "", status: "available" },
            ].map((booking, i) => (
              <div key={i} className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5",
                booking.status === "available"
                  ? "border-primary/30 bg-primary/5 border-dashed"
                  : "border-border bg-card"
              )}>
                <div className="text-center min-w-[50px]">
                  <p className="font-display font-bold text-sm">{booking.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{booking.name}</p>
                  {booking.service && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {booking.service} · {booking.duration}
                    </p>
                  )}
                </div>
                {booking.status === "available" ? (
                  <Button size="sm" className="h-7 text-xs rounded-full">Fill slot</Button>
                ) : (
                  <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">Confirmed</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Post update", desc: "Share work or promo" },
              { label: "Edit services", desc: "Prices & offerings" },
              { label: "Portfolio", desc: "Add photos/videos" },
              { label: "Insights", desc: "Views & analytics" },
            ].map(({ label, desc }) => (
              <button key={label} className="text-left rounded-xl bg-card border border-border p-3.5 hover:border-primary/30 transition-colors">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <BottomNav role="pro" />
    </div>
  );
}
