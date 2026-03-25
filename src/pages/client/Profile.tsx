import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Settings, ChevronRight, Heart, Calendar, Star, Bell, LogOut, Scissors, MapPin, Edit2, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { RoleBadge } from "@/components/RoleBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ClientProfile() {
  const { profile, user, role, isPro, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect professionals to their own pro profile view
  if (role === "professional" || role === "shop_owner") {
    // Handled in App.tsx routing — pros get ProProfileSelf
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["clientStats", profile?.id],
    queryFn: async () => {
      if (!profile) return { bookings: 0, favorites: 0, reviews: 0 };
      const [bookingsRes, favoritesRes, reviewsRes] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("client_profile_id", profile.id),
        supabase.from("favorites").select("id", { count: "exact", head: true }).eq("client_profile_id", profile.id),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("client_profile_id", profile.id),
      ]);
      return {
        bookings: bookingsRes.count || 0,
        favorites: favoritesRes.count || 0,
        reviews: reviewsRes.count || 0,
      };
    },
    enabled: !!profile,
  });

  const { data: recentBookings } = useQuery({
    queryKey: ["recentClientBookings", profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data } = await supabase
        .from("bookings")
        .select(`*, services(service_name), professional_profiles(*, profiles!inner(full_name, avatar_url))`)
        .eq("client_profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!profile,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-20 w-20 rounded-full mx-auto -mt-12" />
        <Skeleton className="h-6 w-40 mx-auto" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const displayName = profile.display_name || profile.full_name || "User";
  const locationParts = [profile.city, profile.state].filter(Boolean);
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Cover gradient */}
      <div className="relative h-36 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Link to="/profile/edit" className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
            <Edit2 className="h-4 w-4" />
          </Link>
          <Link to="/settings" className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="px-4 -mt-14 relative z-10">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full border-4 border-background shadow-lg bg-card flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-primary">{initials}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <h1 className="font-display text-xl font-bold">{displayName}</h1>
            <RoleBadge role={isPro ? "pro" : "client"} size="md" />
            {isPro && <RoleBadge role="client" size="sm" />}
          </div>

          {locationParts.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{locationParts.join(", ")}</span>
            </div>
          )}

          {memberSince && (
            <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
          )}

          {profile.bio && (
            <p className="text-sm text-muted-foreground text-center mt-3 max-w-xs leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Bookings", value: stats?.bookings ?? 0 },
            { label: "Saved", value: stats?.favorites ?? 0 },
            { label: "Reviews", value: stats?.reviews ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center bg-card rounded-xl border border-border p-3">
              <p className="font-display font-bold text-lg">{statsLoading ? "–" : value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-6 space-y-1">
          {[
            { icon: Calendar, label: "My Bookings", to: "/bookings", count: stats?.bookings },
            { icon: Heart, label: "Saved Professionals", to: "/favorites", count: stats?.favorites },
            { icon: Star, label: "My Reviews", to: "/home" },
            { icon: Bell, label: "Notifications", to: "/notifications" },
          ].map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary transition-colors">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Recent bookings */}
        {recentBookings && recentBookings.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-sm">Recent Bookings</h2>
              <Link to="/bookings" className="text-xs text-primary font-medium">See all</Link>
            </div>
            <div className="space-y-2">
              {recentBookings.map((b: any) => {
                const proName = b.professional_profiles?.profiles?.full_name || "Professional";
                const proAvatar = b.professional_profiles?.profiles?.avatar_url;
                return (
                  <div key={b.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                      {proAvatar ? (
                        <img src={proAvatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{proName.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{proName}</p>
                      <p className="text-xs text-muted-foreground">{b.services?.service_name || "Service"} · {b.booking_date}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      b.status === "confirmed" ? "bg-primary/10 text-primary" :
                      b.status === "completed" ? "bg-accent/20 text-accent-foreground" :
                      b.status === "pending" ? "bg-secondary text-secondary-foreground" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Pro switch / upgrade */}
        {isPro ? (
          <div className="mt-6 border-t border-border pt-4">
            <Link to="/pro/dashboard" className="flex items-center gap-3 rounded-xl p-3 bg-primary/5 border border-primary/20">
              <Scissors className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Switch to Pro mode</p>
                <p className="text-xs text-muted-foreground">Manage your professional profile</p>
              </div>
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 border-t border-border pt-4 space-y-3">
            <p className="text-xs text-muted-foreground text-center px-4">
              Clients can browse and book. Become a Professional to offer services and receive bookings.
            </p>
            <Link to="/upgrade-to-pro" className="flex items-center gap-3 rounded-xl p-3 bg-accent/10 border border-accent/30">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Become a Professional</p>
                <p className="text-xs text-muted-foreground">Offer services and receive bookings</p>
              </div>
              <ChevronRight className="h-4 w-4 text-accent-foreground" />
            </Link>
          </div>
        )}

        <Button variant="ghost" className="w-full text-muted-foreground gap-2 mt-6" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <BottomNav role="client" />
    </div>
  );
}
