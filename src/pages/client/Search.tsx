import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { FilterSheet } from "@/components/FilterSheet";
import { useProfessionals } from "@/hooks/use-data";
import { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

interface Filters {
  statuses: string[];
  categories: string[];
  walkIns: boolean | null;
  distanceMiles: number | null;
}

const defaultFilters: Filters = {
  statuses: [],
  categories: [],
  walkIns: null,
  distanceMiles: null,
};

export default function Search() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) { setLocationDenied(true); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserCoords({ latitude: coords.latitude, longitude: coords.longitude }),
      () => setLocationDenied(true),
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 5000 }
    );
  }, []);

  // Fetch ALL professionals, apply filters client-side for consistency
  const { data: allProfessionals, isLoading } = useProfessionals({
    status: filters.statuses.length > 0 ? filters.statuses : undefined,
    categories: filters.categories.length > 0 ? filters.categories : undefined,
  });

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const hasActiveFilters = query || filters.statuses.length > 0 || filters.categories.length > 0 || filters.walkIns !== null || filters.distanceMiles !== null;

  const results = useMemo(() => {
    let list = allProfessionals || [];

    // Walk-ins filter
    if (filters.walkIns !== null) {
      list = list.filter(p => p.accepts_walk_ins === filters.walkIns);
    }

    // Distance filter
    if (filters.distanceMiles !== null && filters.distanceMiles > 0) {
      list = list.filter((p) => {
        // If we have both user coords and pro coords, do real distance
        if (userCoords && p.latitude && p.longitude) {
          return haversineDistance(userCoords.latitude, userCoords.longitude, p.latitude, p.longitude) <= filters.distanceMiles!;
        }
        // Fallback: match by city if available
        if (profile?.city && p.city) {
          return profile.city.trim().toLowerCase() === p.city.trim().toLowerCase();
        }
        // If no location data at all, include the result (don't exclude unfairly)
        return true;
      });
    }

    // Text search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(p =>
        p.full_name.toLowerCase().includes(q) ||
        (p.display_name || "").toLowerCase().includes(q) ||
        (p.business_name || "").toLowerCase().includes(q) ||
        (p.specialties || []).some(s => s.toLowerCase().includes(q)) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q) ||
        (p.shop_name || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [allProfessionals, filters, query, userCoords, profile]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search barbers, braiders, nails..."
              className="pl-9 rounded-xl bg-secondary border-0"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <FilterSheet
            onApply={setFilters}
            locationAvailable={!!userCoords}
            locationDenied={locationDenied}
          />
        </div>
      </header>
      <div className="px-4 pt-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-60 rounded-2xl" />)}
          </div>
        ) : !hasActiveFilters ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-display font-semibold text-sm">Search for professionals</p>
            <p className="text-xs text-muted-foreground mt-1">Try "fade", "braids", "nails", or a name</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🤷</p>
            <p className="font-display font-semibold text-sm">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filters.distanceMiles !== null && !userCoords
                ? "Enable location access for better distance results, or try removing the distance filter"
                : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
              {filters.distanceMiles !== null && !userCoords && (
                <span className="ml-1">· Distance filtered by city (enable location for precise results)</span>
              )}
            </p>
            {results.map(pro => <ProCard key={pro.id} pro={pro} />)}
          </>
        )}
      </div>
      <BottomNav role="client" />
    </div>
  );
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
