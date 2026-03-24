import { useMemo, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { StatusBadge } from "@/components/StatusBadge";
import { OpenChairToggle } from "@/components/OpenChairToggle";
import { CreatePostSheet } from "@/components/CreatePostSheet";
import { SocialFeedCard } from "@/components/SocialFeedCard";
import { useMyProProfile, useUpdateStatus, useMyBookings, useReviewsForPro, useRealtimeProfessionals, useFeed, useRealtimeBookings } from "@/hooks/use-data";
import { Skeleton as FeedSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Eye, Users, Calendar, Star, Bell, Settings, ChevronRight, User, Scissors, Image, CheckCircle, Clock, XCircle, Plus, PenSquare } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { categoryLabels } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const statuses = [
  { value: "open-chair", emoji: "🪑", label: "Open Chair", desc: "Walk-ins welcome" },
  { value: "available-now", emoji: "⚡", label: "Available Now", desc: "Taking clients now" },
  { value: "last-minute", emoji: "🔥", label: "Last-Minute", desc: "Cancellation slot open" },
  { value: "appointment-only", emoji: "📅", label: "Appt Only", desc: "By appointment" },
  { value: "busy", emoji: "🚫", label: "Busy", desc: "With a client" },
  { value: "offline", emoji: "💤", label: "Offline", desc: "Not working" },
] as const;

function useMyPosts(proProfileId: string | undefined) {
  return useQuery({
    queryKey: ["myPosts", proProfileId],
    queryFn: async () => {
      if (!proProfileId) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("professional_profile_id", proProfileId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: !!proProfileId,
  });
}

export default function ProDashboard() {
  return <ProDashboardInner />;
}

function ActivityFeedSection() {
  const { data: feed, isLoading } = useFeed();
  if (isLoading) {
    return (
      <section>
        <h2 className="font-display font-bold text-base mb-3">Activity Feed</h2>
        <div className="space-y-4">
          {[1, 2].map(i => <FeedSkeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </section>
    );
  }
  if (!feed || feed.length === 0) return null;
  return (
    <section>
      <h2 className="font-display font-bold text-base mb-3">Activity Feed</h2>
      <div className="space-y-4">
        {feed.slice(0, 10).map((post: any) => (
          <SocialFeedCard key={post.id} post={post} isLiked={post._isLiked} isReposted={post._isReposted} />
        ))}
      </div>
    </section>
  );
}

function ProDashboardInner() {
  const { profile } = useAuth();
  const { data: proProfile, isLoading } = useMyProProfile();
  const updateStatus = useUpdateStatus();
  const { data: bookings } = useMyBookings("pro");
  const { data: reviews } = useReviewsForPro(proProfile?.id);
  const { data: myPosts } = useMyPosts(proProfile?.id);
  const [statusNote, setStatusNote] = useState("");
  const [statusDuration, setStatusDuration] = useState("none");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [postSheetOpen, setPostSheetOpen] = useState(false);

  useRealtimeProfessionals();
  useRealtimeBookings();

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
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
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
      { status, note: statusNote || undefined, expiresAt: statusExpiresAt },
      {
        onSuccess: () => {
          toast.success("Status updated!");
          setSheetOpen(false);
          setStatusNote("");
          setStatusDuration("none");
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  const displayName = proProfile.display_name || proProfile.business_name || proProfile.full_name;
  const allBookings = bookings || [];
  const pendingBookings = allBookings.filter((b: any) => b.status === "pending");
  const confirmedBookings = allBookings.filter((b: any) => b.status === "confirmed");
  const completedBookings = allBookings.filter((b: any) => b.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
              {proProfile.avatar_url ? (
                <img src={proProfile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-primary text-lg">{displayName.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-display font-bold text-sm">{displayName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{categoryLabels[proProfile.category] || proProfile.category}</span>
                {proProfile.city && <span className="text-[10px] text-muted-foreground">· {proProfile.city}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/notifications" className="relative h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </Link>
            <Link to="/settings" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-5">
        {/* OPEN CHAIR TOGGLE — THE HERO */}
        <OpenChairToggle currentStatus={proProfile.status} />

        {/* Create Post CTA */}
        <button
          onClick={() => setPostSheetOpen(true)}
          className="w-full flex items-center gap-3 rounded-2xl bg-card border border-border p-4 hover:border-primary/30 transition-colors text-left"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {proProfile.avatar_url ? (
              <img src={proProfile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display font-bold text-primary text-sm">{displayName.charAt(0)}</span>
            )}
          </div>
          <span className="text-sm text-muted-foreground flex-1">Share an update, promo, or photo...</span>
          <PenSquare className="h-5 w-5 text-primary" />
        </button>

        {/* Status Control */}
        <section className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">Status Details</h2>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-7">Change</Button>
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
                          proProfile.status === s.value ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/30"
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
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Status note</label>
                    <Input placeholder="e.g. Walk-ins welcome" value={statusNote} onChange={e => setStatusNote(e.target.value)} className="mt-1 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Auto-expire</label>
                    <Select value={statusDuration} onValueChange={setStatusDuration}>
                      <SelectTrigger className="mt-1 rounded-xl text-sm"><SelectValue placeholder="No expiration" /></SelectTrigger>
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
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={proProfile.status} size="md" pulse />
            {proProfile.status_expires_at && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Until {new Date(proProfile.status_expires_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
          </div>
          {proProfile.status_note && (
            <div className="rounded-xl bg-secondary p-2.5 mt-2">
              <p className="text-xs text-muted-foreground">📝 {proProfile.status_note}</p>
            </div>
          )}
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Total bookings", value: allBookings.length.toString() },
              { icon: Clock, label: "Pending", value: pendingBookings.length.toString() },
              { icon: CheckCircle, label: "Completed", value: completedBookings.length.toString() },
              { icon: Users, label: "Followers", value: (proProfile.follower_count || 0).toString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-card border border-border p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
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

        {/* Pending Booking Requests */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">Pending Requests</h2>
            {pendingBookings.length > 0 && (
              <Link to="/pro/bookings" className="text-xs text-primary font-medium">View all</Link>
            )}
          </div>
          {pendingBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingBookings.slice(0, 3).map((booking: any) => (
                <Link key={booking.id} to="/pro/bookings" className="block rounded-xl border border-border bg-card p-3.5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{booking.profiles?.full_name || "Client"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.services?.service_name || "Service"} · {booking.booking_date} · {booking.start_time?.slice(0, 5)}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-accent bg-accent/10 rounded-full px-2 py-0.5">Pending</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Activity Feed — posts from followed pros + trending */}
        <ActivityFeedSection />

        {/* My Posts Feed */}
        {myPosts && myPosts.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-base mb-3">Your Posts</h2>
            <div className="space-y-4">
              {myPosts.slice(0, 5).map((post: any) => (
                <SocialFeedCard
                  key={post.id}
                  post={{
                    ...post,
                    pro_name: displayName,
                    pro_avatar: proProfile.avatar_url,
                    pro_category: proProfile.category,
                    pro_status: proProfile.status,
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Quick Actions</h2>
          <div className="space-y-1">
            {[
              { label: "Edit Profile", desc: "Update your info & bio", to: "/pro/profile-edit", icon: User },
              { label: "Public Preview", desc: "See what clients see", to: `/pro/${proProfile.id}`, icon: Eye },
              { label: "Manage Services", desc: "Add or edit pricing", to: "/pro/services", icon: Scissors },
              { label: "Portfolio", desc: "Upload your work", to: "/pro/portfolio", icon: Image },
              { label: "Bookings", desc: "Manage appointments", to: "/pro/bookings", icon: Calendar },
            ].map(({ label, desc, to, icon: Icon }) => (
              <Link key={label} to={to} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3.5 hover:border-primary/30 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* FAB for creating post */}
      <button
        onClick={() => setPostSheetOpen(true)}
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Plus className="h-6 w-6" />
      </button>

      <CreatePostSheet
        open={postSheetOpen}
        onOpenChange={setPostSheetOpen}
        proProfileId={proProfile.id}
      />

      <BottomNav role="pro" />
    </div>
  );
}
