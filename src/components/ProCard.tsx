import { Professional } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { categoryLabels } from "@/data/mock";
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProCardProps {
  pro: Professional;
  variant?: "compact" | "full";
}

export function ProCard({ pro, variant = "full" }: ProCardProps) {
  if (variant === "compact") {
    return (
      <Link to={`/pro/${pro.id}`} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border hover:border-primary/30 transition-colors">
        <div className="relative">
          <img src={pro.avatar} alt={pro.name} className="h-12 w-12 rounded-full object-cover" />
          <span className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
            ["open-chair", "available-now"].includes(pro.status) ? "bg-status-available" :
            pro.status === "last-minute" ? "bg-status-last-minute" :
            pro.status === "busy" ? "bg-status-busy" : "bg-status-offline"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">{pro.name}</p>
          <p className="text-xs text-muted-foreground">{categoryLabels[pro.category]} · {pro.city}</p>
        </div>
        <StatusBadge status={pro.status} size="sm" />
      </Link>
    );
  }

  return (
    <Link to={`/pro/${pro.id}`} className="group block rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="relative h-40 overflow-hidden">
        <img src={pro.portfolio[0] || pro.coverImage} alt={pro.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={pro.status} size="md" />
        </div>
        <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center hover:bg-card/80 transition-colors" onClick={(e) => e.preventDefault()}>
          <Heart className="h-4 w-4" />
        </button>
        {pro.promo && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs font-medium text-primary-foreground bg-primary/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 truncate">
              🔥 {pro.promo}
            </p>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img src={pro.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-card" />
            <div>
              <h3 className="font-display font-semibold text-sm">{pro.name}</h3>
              <p className="text-xs text-muted-foreground">{categoryLabels[pro.category]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold">{pro.rating}</span>
            <span className="text-muted-foreground">({pro.reviewCount})</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{pro.city}</span>
            <span>·</span>
            <span>From ${Math.min(...pro.services.map(s => s.price))}</span>
          </div>
          {pro.nextAvailable && (
            <span className="text-xs font-medium text-primary">
              {pro.nextAvailable === "Now" ? "⚡ Now" : `Next: ${pro.nextAvailable}`}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {pro.specialties.slice(0, 3).map(s => (
            <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{s}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
