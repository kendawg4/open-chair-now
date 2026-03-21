import { useMemo, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { useMyProProfile, useUpdateStatus, useMyBookings } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Eye, Users, Calendar, Star, Bell, Settings, ChevronRight, User, Scissors, Image, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = [
  { value: "open-chair", emoji: "🪑", label: "Open Chair", desc: "Chair is open, walk-ins welcome" },
  { value: "available-now", emoji: "⚡", label: "Available Now", desc: "Taking clients right now" },
  { value: "last-minute", emoji: "🔥", label: "Last-Minute", desc: "Cancellation slot opened up" },
  { value: "appointment-only", emoji: "📅", label: "Appt Only", desc: "By appointment only" },
  { value: "busy", emoji: "🚫", label: "Busy", desc: "Currently with a client" },
  { value: "offline", emoji: "💤", label: "Offline", desc: "Not working right now" },
] as const;

export default function ProDashboard() {
  const { profile } = useAuth();
  const { data: proProfile, isLoading } = useMyProProfile();
  const updateStatus = useUpdateStatus();
  const { data: bookings } = useMyBookings("pro");
  const [statusNote, setStatusNote] = useState("");
  const [statusPromo, setStatusPromo] = useState("");
  const [statusDuration, setStatusDuration] = useState("none");
  const [sheetOpen, setSheetOpen] = useState(false);

  const statusExpiresAt = useMemo(() => {
    if (statusDuration === "none") return null;
    const now = new Date();
    if (statusDuration === "30m") now.setMinutes(now.getMinutes() + 30);
    if (statusDuration === "1h") now.setHours(now.getHours() + 1);
    if (statusDuration === "3h") now.setHours(now.getHours() + 3);
    if (statusDuration === "eod") now.setHours(23, 59, 0, 0);
    return now.toISOString();
  }, [statusDuration]);

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
    updateStatus.mutate(
      { status, note: statusNote || undefined, promo: statusPromo || undefined, expiresAt: statusExpiresAt },
      {
        onSuccess: () => {
          toast.success("Status updated!");
          setSheetOpen(false);
          setStatusNote("");
          setStatusPromo("");
          setStatusDuration("none");
        },
        onError: (e) => toast.error(e.message),
      }
    );
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
          <div className="flex gap-2">
            <Link to="/notifications" className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </Link>
            <Link to="/settings" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-6">
        {/* Status Control — the signature feature */}
        <section className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display font-bold text-base">Your status</h2>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={proProfile.status} size="md" pulse />
                {proProfile.status_expires_at && (
                  <span className="text-[11px] text-muted-foreground">
                    Until {new Date(proProfile.status_expires_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-7">
                  Change status
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle className="font-display">Update your status</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {statuses.map(s => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(s.value)}
                        disabled={updateStatus.isPending}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-xl border p-3 transition-all text-left",
                          proProfile.status === s.value
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{s.emoji}</span>
                          <span className="text-xs font-semibold">{s.label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Status note (optional)</label>
                      <Input
                        placeholder="e.g. Walk-ins welcome, Cancellation at 2:15 PM"
                        value={statusNote}
                        onChange={e => setStatusNote(e.target.value)}
                        className="mt-1 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Promo (optional)</label>
                      <Input
                        placeholder="e.g. 10% off, beard included"
                        value={statusPromo}
                        onChange={e => setStatusPromo(e.target.value)}
                        className="mt-1 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Status expiration</label>
                      <Select value={statusDuration} onValueChange={setStatusDuration}>
                        <SelectTrigger className="mt-1 rounded-xl text-sm">
                          <SelectValue placeholder="No expiration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No expiration</SelectItem>
                          <SelectItem value="30m">30 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="3h">3 hours</SelectItem>
                          <SelectItem value="eod">End of day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Quick status grid */}
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
                <span className="text-[10px] font-medium">{s.label}</span>
              </button>
            ))}
          </div>

          {proProfile.status_note && (
            <div className="mt-3 rounded-xl bg-secondary p-2.5">
              <p className="text-xs text-muted-foreground">📝 {proProfile.status_note}</p>
            </div>
          )}
          {proProfile.status_promo && (
            <div className="mt-2 rounded-xl bg-accent/10 border border-accent/20 p-2.5">
              <p className="text-xs text-accent font-medium">🔥 {proProfile.status_promo}</p>
            </div>
          )}

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
          <div className="space-y-1">
            {[
              { label: "Edit profile", desc: "Update your info", to: "/pro/profile-edit", icon: User },
              { label: "Public profile preview", desc: "See what clients see", to: "/pro/preview", icon: Eye },
              { label: "Manage services", desc: "View your service menu", to: "/pro/services", icon: Scissors },
              { label: "Manage portfolio", desc: "Review your portfolio", to: "/pro/portfolio", icon: Image },
              { label: "Bookings", desc: "Handle requests and appointments", to: "/pro/bookings", icon: Calendar },
              { label: "Notifications", desc: "Check recent updates", to: "/notifications", icon: Bell },
              { label: "Settings", desc: "Account and preferences", to: "/settings", icon: Settings },
            ].map(({ label, desc, to, icon: Icon }) => (
              <Link key={label} to={to} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3.5 hover:border-primary/30 transition-colors">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="font-display font-bold text-base">Mode</h2>
          </div>
          <p className="text-sm font-medium">Professional mode is active</p>
          <p className="text-xs text-muted-foreground mt-1">Professional accounts stay in the pro app shell and land here after login.</p>
        </section>
      </div>

      <BottomNav role="pro" />
    </div>
  );
}
