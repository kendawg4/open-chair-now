import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { FilterSheet } from "@/components/FilterSheet";
import { useProfessionals } from "@/hooks/use-data";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<{ statuses: string[]; categories: string[]; walkIns: boolean | null }>({
    statuses: [],
    categories: [],
    walkIns: null,
  });

  const { data: professionals, isLoading } = useProfessionals({
    search: query || undefined,
    status: filters.statuses.length > 0 ? filters.statuses : undefined,
    category: filters.categories.length === 1 ? filters.categories[0] : undefined,
  });

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  let results = query || filters.statuses.length || filters.categories.length || filters.walkIns !== null
    ? (professionals || [])
    : [];

  // Client-side filtering for multi-category and walk-ins
  if (filters.categories.length > 1) {
    results = results.filter(p => filters.categories.includes(p.category));
  }
  if (filters.walkIns !== null) {
    results = results.filter(p => p.accepts_walk_ins === filters.walkIns);
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p =>
      p.full_name.toLowerCase().includes(q) ||
      (p.specialties || []).some(s => s.toLowerCase().includes(q)) ||
      p.category.includes(q) ||
      (p.city || "").toLowerCase().includes(q)
    );
  }

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
          <FilterSheet onApply={setFilters} />
        </div>
      </header>
      <div className="px-4 pt-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-60 rounded-2xl" />)}
          </div>
        ) : !query && !filters.statuses.length && !filters.categories.length ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-display font-semibold text-sm">Search for professionals</p>
            <p className="text-xs text-muted-foreground mt-1">Try "fade", "braids", "nails", or a name</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🤷</p>
            <p className="font-display font-semibold text-sm">No results found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search or filter</p>
          </div>
        ) : (
          results.map(pro => <ProCard key={pro.id} pro={pro} />)
        )}
      </div>
      <BottomNav role="client" />
    </div>
  );
}
