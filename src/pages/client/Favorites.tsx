import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { useMyFavorites } from "@/hooks/use-data";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favorites() {
  const { data: favorites, isLoading } = useMyFavorites();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/home"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Saved Pros</h1>
        </div>
      </header>
      <div className="px-4 pt-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1,2].map(i => <Skeleton key={i} className="h-60 rounded-2xl" />)}
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💜</p>
            <p className="font-display font-semibold text-sm">No saved professionals yet</p>
            <p className="text-xs text-muted-foreground mt-1">Tap the heart on any pro to save them</p>
          </div>
        ) : (
          favorites.map(fav => (
            <ProCard key={fav.id} pro={fav.pro} />
          ))
        )}
      </div>
      <BottomNav role="client" />
    </div>
  );
}
