import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/BottomNav";
import { RoleBadge } from "@/components/RoleBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PublicProfile() {
  const { id } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["publicProfile", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Check if this profile has a pro profile
  const { data: proProfile } = useQuery({
    queryKey: ["publicProfilePro", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await supabase
        .from("professional_profiles")
        .select("id")
        .eq("profile_id", id)
        .maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-display text-lg font-semibold">User not found</p>
          <p className="text-sm text-muted-foreground mt-1">This profile may not exist.</p>
          <Link to="/home"><button className="mt-4 text-primary text-sm font-medium">Back to Home</button></Link>
        </div>
      </div>
    );
  }

  const displayName = profile.display_name || profile.full_name;
  const locationParts = [profile.city, profile.state].filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display font-bold text-lg">Profile</h1>
        </div>
      </header>

      <div className="px-4 pt-6">
        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display font-bold text-3xl text-primary">{displayName.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-xl font-bold truncate">{displayName}</h2>
              <RoleBadge role={proProfile ? "pro" : "client"} size="md" />
            </div>
            {locationParts.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>{locationParts.join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
        )}

        {/* If they're a pro, link to their full pro profile */}
        {proProfile && (
          <Link
            to={`/pro/${proProfile.id}`}
            className="mt-4 block rounded-xl border border-primary/20 bg-primary/5 p-4 text-center"
          >
            <p className="text-sm font-semibold text-primary">View Professional Profile →</p>
          </Link>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
