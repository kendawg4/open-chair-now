import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { mockProfessionals } from "@/data/mock";
import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Search() {
  const [query, setQuery] = useState("");
  const results = query
    ? mockProfessionals.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.specialties.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        p.category.includes(query.toLowerCase())
      )
    : [];

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
          <button className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="px-4 pt-4 space-y-4">
        {!query && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-display font-semibold text-sm">Search for professionals</p>
            <p className="text-xs text-muted-foreground mt-1">Try "fade", "braids", "nails", or a name</p>
          </div>
        )}
        {query && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🤷</p>
            <p className="font-display font-semibold text-sm">No results for "{query}"</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
        {results.map(pro => (
          <ProCard key={pro.id} pro={pro} />
        ))}
      </div>
      <BottomNav role="client" />
    </div>
  );
}
