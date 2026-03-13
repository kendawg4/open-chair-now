import { BottomNav } from "@/components/BottomNav";
import { ProCard } from "@/components/ProCard";
import { mockProfessionals } from "@/data/mock";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Favorites() {
  const favs = mockProfessionals.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/home"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Saved Pros</h1>
        </div>
      </header>
      <div className="px-4 pt-4 space-y-4">
        {favs.map(pro => (
          <ProCard key={pro.id} pro={pro} />
        ))}
      </div>
      <BottomNav role="client" />
    </div>
  );
}
