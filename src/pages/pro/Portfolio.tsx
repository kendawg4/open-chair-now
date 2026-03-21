import { BottomNav } from "@/components/BottomNav";
import { useMyProProfile } from "@/hooks/use-data";
import { ArrowLeft, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProPortfolio() {
  const { data: proProfile, isLoading } = useMyProProfile();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Portfolio</h1>
        </div>
      </header>

      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}</div>
        ) : !proProfile?.portfolio_items?.length ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Image className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display font-semibold text-sm">No portfolio images yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Your uploaded work will appear here for quick review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {proProfile.portfolio_items.map((item: any) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={item.media_url} alt={item.caption || "Portfolio item"} className="aspect-square w-full object-cover" />
                {item.caption && <p className="p-3 text-xs text-muted-foreground">{item.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="pro" />
    </div>
  );
}