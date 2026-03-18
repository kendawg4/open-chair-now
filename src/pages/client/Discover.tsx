import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { useProfessionals, useRealtimeProfessionals } from "@/hooks/use-data";
import { categoryLabels } from "@/lib/constants";
import { useState } from "react";
import { ArrowLeft, MapPin, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const filters = ["All", "Available Now", "Open Chair", "Barber", "Stylist", "Braider", "Nails", "Lashes", "Tattoo"];

export default function Discover() {
  const [view, setView] = useState<"map" | "list">("list");
  const [activeFilter, setActiveFilter] = useState("All");
  useRealtimeProfessionals();

  const statusFilter = activeFilter === "Available Now"
    ? ["open-chair", "available-now", "last-minute"]
    : activeFilter === "Open Chair"
    ? ["open-chair"]
    : undefined;

  const categoryFilter = !["All", "Available Now", "Open Chair"].includes(activeFilter)
    ? Object.entries(categoryLabels).find(([_, label]) =>
        label.toLowerCase().startsWith(activeFilter.toLowerCase())
      )?.[0]
    : undefined;

  const { data: professionals, isLoading } = useProfessionals({
    status: statusFilter,
    category: categoryFilter,
  });

  const filtered = professionals || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/home"><ArrowLeft className="h-5 w-5" /></Link>
            <h1 className="font-display font-bold text-lg">Discover</h1>
          </div>
          <div className="flex gap-2">
            <Button variant={view === "map" ? "default" : "outline"} size="icon" className="h-9 w-9 rounded-xl" onClick={() => setView("map")}>
              <MapPin className="h-4 w-4" />
            </Button>
            <Button variant={view === "list" ? "default" : "outline"} size="icon" className="h-9 w-9 rounded-xl" onClick={() => setView("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors",
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <div className="px-4 pt-4 space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-60 rounded-2xl" />)}
        </div>
      ) : view === "map" ? (
        <div className="relative">
          <div className="h-[50vh] bg-secondary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23888' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
            {filtered.map((pro, i) => (
              <Link key={pro.id} to={`/pro/${pro.id}`} className="absolute" style={{ left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 20}%` }}>
                <div className={cn(
                  "h-10 w-10 rounded-full border-3 border-card shadow-lg flex items-center justify-center overflow-hidden ring-2",
                  ["open-chair", "available-now"].includes(pro.status) ? "ring-status-available" :
                  pro.status === "last-minute" ? "ring-status-last-minute" : "ring-border"
                )}>
                  {pro.avatar_url ? (
                    <img src={pro.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-primary">{(pro.full_name || "?").charAt(0)}</span>
                  )}
                </div>
              </Link>
            ))}
            <p className="text-sm text-muted-foreground font-medium z-10 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-xl">
              🗺️ Map integration coming soon
            </p>
          </div>
          <div className="px-4 pt-4 space-y-3">
            <p className="text-sm font-display font-semibold">{filtered.length} professionals nearby</p>
            {filtered.map(pro => <ProCard key={pro.id} pro={pro} variant="compact" />)}
          </div>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-display font-semibold text-sm">No professionals found</p>
              <p className="text-xs text-muted-foreground mt-1">Try changing your filters</p>
            </div>
          ) : (
            filtered.map(pro => <ProCard key={pro.id} pro={pro} />)
          )}
        </div>
      )}

      <BottomNav role="client" />
    </div>
  );
}
