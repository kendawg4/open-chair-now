import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { useMyProProfile, useUpdateStatus, useMyBookings } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Eye, Users, Calendar, Star, Bell, ChevronRight, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const statuses = [
  { value: "open-chair", emoji: "🪑" },
  { value: "available-now", emoji: "⚡" },
  { value: "last-minute", emoji: "🔥" },
  { value: "appointment-only", emoji: "📅" },
  { value: "busy", emoji: "🚫" },
  { value: "offline", emoji: "💤" },
] as const;

export default function ProDashboard() {
  const { profile } = useAuth();
  const { data: proProfile, isLoading } = useMyProProfile();
  const updateStatus = useUpdateStatus();
  const { data: bookings } = useMyBookings("pro");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  if (!proProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-4xl">✂️</p>
          <h1 className="font-display text-xl font-bold">Complete your pro profile</h1>
          <p className="text-sm text-muted-foreground">Set up your professional profile to start getting discovered</p>
          <Button asChild className="rounded-xl">
            <Link to="/onboarding/pro">Set Up Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: string) => {
    updateStatus.mutate({ status }, {
      onSuccess: () => toast.success("Status updated!"),
      onError: (e) => toast.error(e.message),
    });
  };

  const displayName = proProfile.display_name || proProfile.business_name || proProfile.full_name;
  const pendingBookings = (bookings || []).filter((b: any) => b.status === "pending");
  const confirmedBookings = (bookings || []).filter((b: any) => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {proProfile.avatar_url ? (
                <img src={proProfile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-primary">{displayName.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-display font-bold text-sm">{displayName}</p>
              <StatusBadge status={proProfile.status} size="sm" />
            </div>
          </div>
          <button className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Bell className="h-5 w-5" />
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
                onClick={() => handleStatusChange(s.value)}
                disabled={updateStatus.isPending}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                  proProfile.status === s.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/30"
                )}
              >
                <span className="text-lg">{s.emoji}</span>
                <StatusBadge status={s.value} size="sm" />
              </button>
            ))}
          </div>
          {["open-chair", "available-now", "last-minute"].includes(proProfile.status) && (
            <div className="mt-3 rounded-xl bg-primary/10 border border-primary/20 p-3">
              <p className="text-xs text-primary font-medium">✅ You're visible to nearby clients!</p>
            </div>
          )}
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Pending bookings", value: pendingBookings.length.toString() },
              { icon: Users, label: "Followers", value: (proProfile.follower_count || 0).toString() },
              { icon: Star, label: "Avg. rating", value: Number(proProfile.average_rating || 0).toFixed(1) },
              { icon: Eye, label: "Total reviews", value: (proProfile.total_reviews || 0).toString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-card border border-border p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="font-display font-bold text-xl">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Bookings */}
        {pendingBookings.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-base mb-3">Pending Requests</h2>
            <div className="space-y-2">
              {pendingBookings.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="rounded-xl border border-border bg-card p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{booking.profiles?.full_name || "Client"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.services?.service_name || "Service"} · {booking.booking_date}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-accent bg-accent/10 rounded-full px-2 py-0.5">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Edit profile", desc: "Update your info" },
              { label: "Edit services", desc: "Prices & offerings" },
              { label: "Portfolio", desc: "Add photos" },
              { label: "View as client", desc: "See your public profile" },
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
