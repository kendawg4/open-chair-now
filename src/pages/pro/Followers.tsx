import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/BottomNav";
import { RoleBadge } from "@/components/RoleBadge";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useFollowers(proProfileId: string | undefined) {
  return useQuery({
    queryKey: ["followers", proProfileId],
    queryFn: async () => {
      if (!proProfileId) return [];
      const { data, error } = await supabase
        .from("follows")
        .select("*, profiles:client_profile_id(id, full_name, display_name, avatar_url)")
        .eq("professional_profile_id", proProfileId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((f: any) => ({
        id: f.profiles?.id,
        full_name: f.profiles?.full_name || "User",
        display_name: f.profiles?.display_name,
        avatar_url: f.profiles?.avatar_url,
      }));
    },
    enabled: !!proProfileId,
  });
}

export default function FollowersPage() {
  const { id } = useParams();
  const { role } = useAuth();
  const { data: followers, isLoading } = useFollowers(id);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => window.history.back()}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="font-display font-bold text-lg">Followers</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-2">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : !followers?.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display font-semibold text-sm">No followers yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Followers will appear here as people follow this profile.</p>
          </div>
        ) : (
          followers.map((f: any) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {f.avatar_url ? (
                  <img src={f.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-primary">{(f.display_name || f.full_name).charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm truncate">{f.display_name || f.full_name}</p>
                  <RoleBadge role="client" size="sm" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav role={role === "professional" || role === "shop_owner" ? "pro" : "client"} />
    </div>
  );
}
