import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { FeedCard } from "@/components/FeedCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProfessionals, mockFeed } from "@/data/mock";
import { Link } from "react-router-dom";
import { MapPin, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientHome() {
  const availableNow = mockProfessionals.filter(p =>
    ["open-chair", "available-now", "last-minute"].includes(p.status)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold">Open<span className="text-primary">Chair</span></p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Brooklyn, NY</span>
            </div>
          </div>
          <button className="relative h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-status-busy border-2 border-card" />
          </button>
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
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {availableNow.map(pro => (
              <div key={pro.id} className="w-[280px] shrink-0">
                <ProCard pro={pro} />
              </div>
            ))}
          </div>
        </section>

        {/* Quick categories */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Browse by category</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {["✂️ Barber", "💇‍♀️ Stylist", "🧶 Braider", "💅 Nails", "🧖‍♀️ Esthetician", "👁️ Lashes", "💄 Makeup", "🎨 Tattoo"].map(cat => (
              <button key={cat} className="shrink-0 rounded-full bg-secondary px-4 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                {cat}
              </button>
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

        {/* Feed */}
        <section>
          <h2 className="font-display font-bold text-base mb-3">Latest updates</h2>
          <div className="space-y-4">
            {mockFeed.map(post => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav role="client" />
    </div>
  );
}
