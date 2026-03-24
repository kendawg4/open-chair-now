import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { SocialFeedCard } from "@/components/SocialFeedCard";
import { StatusBadge } from "@/components/StatusBadge";
import { OpenChairsMap } from "@/components/OpenChairsMap";
import { useProfessionals, useFeed, useRealtimeProfessionals } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { Link } from "react-router-dom";
import { MapPin, Bell, ChevronRight, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientHome() {
  const { profile } = useAuth();
  const { data: professionals, isLoading: prosLoading } = useProfessionals();
  const { data: feed, isLoading: feedLoading } = useFeed();
  useRealtimeProfessionals();

  const availableNow = (professionals || []).filter(p =>
    ["open-chair", "available-now", "last-minute"].includes(p.status)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold">Open<span className="text-primary">Chair</span></p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{profile?.city || "Nearby"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/messages" className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link to="/notifications" className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-6">
        {/* Available Now */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base">Available Now</h2>
              <StatusBadge status="open-chair" size="sm" pulse />
            </div>
            <Link to="/discover" className="flex items-center gap-0.5 text-xs text-primary font-medium">
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {prosLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {[1,2].map(i => <Skeleton key={i} className="w-[280px] h-[240px] shrink-0 rounded-2xl" />)}
            </div>
          ) : availableNow.length === 0 ? (
            <div className="text-center py-8 bg-card rounded-2xl border border-border">
              <p className="text-2xl mb-2">😴</p>
              <p className="text-sm text-muted-foreground">No pros available right now</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {availableNow.map(pro => (
                <div key={pro.id} className="w-[280px] shrink-0">
                  <ProCard pro={pro} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick categories */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Browse by category</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {["✂️ Barber", "💇‍♀️ Stylist", "🧶 Braider", "💅 Nails", "🧖‍♀️ Esthetician", "👁️ Lashes", "💄 Makeup", "🎨 Tattoo"].map(cat => (
              <Link key={cat} to={`/search?q=${cat.split(" ")[1]}`} className="shrink-0 rounded-full bg-secondary px-4 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Map CTA */}
        <Link to="/discover" className="block rounded-2xl bg-primary/10 border border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm">Discover on map</p>
              <p className="text-xs text-muted-foreground">See all pros near you with live status</p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary" />
          </div>
        </Link>

        {/* Activity Feed — social posts from pros */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Activity Feed</h2>
          {feedLoading ? (
            <div className="space-y-4">
              {[1,2].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
            </div>
          ) : (feed || []).length === 0 ? (
            <div className="text-center py-8 bg-card rounded-2xl border border-border">
              <p className="text-2xl mb-2">📝</p>
              <p className="text-sm text-muted-foreground">No posts yet. Follow pros to see their updates!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(feed || []).map(post => (
                <SocialFeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav role="client" />
    </div>
  );
}
