import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { categoryLabels } from "@/lib/constants";
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ProWithProfile } from "@/hooks/use-data";

interface ProCardProps {
  pro: ProWithProfile;
  variant?: "compact" | "full";
}

export function ProCard({ pro, variant = "full" }: ProCardProps) {
  const minPrice = pro.services && pro.services.length > 0
    ? Math.min(...pro.services.map((s: any) => Number(s.price)))
    : null;

  const firstPortfolio = pro.portfolio_items && pro.portfolio_items.length > 0
    ? pro.portfolio_items[0].media_url
    : null;

  const displayName = pro.display_name || pro.business_name || pro.full_name;

  if (variant === "compact") {
    return (
      <Link to={`/pro/${pro.id}`} className="flex items-center gap-3 rounded-xl bg-card p-3 border border-border hover:border-primary/30 transition-colors">
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {pro.avatar_url ? (
              <img src={pro.avatar_url} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display font-bold text-primary text-sm">{displayName.charAt(0)}</span>
            )}
          </div>
          <span className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
            ["open-chair", "available-now"].includes(pro.status) ? "bg-status-available" :
            pro.status === "last-minute" ? "bg-status-last-minute" :
            pro.status === "busy" ? "bg-status-busy" : "bg-status-offline"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate flex items-center gap-1">{displayName} <RoleBadge role="pro" /></p>
          <p className="text-xs text-muted-foreground">{categoryLabels[pro.category] || pro.category} · {pro.city || "Nearby"}</p>
        </div>
        <StatusBadge status={pro.status} size="sm" />
      </Link>
    );
  }

  return (
    <Link to={`/pro/${pro.id}`} className="group block rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-secondary">
        {firstPortfolio ? (
          <img src={firstPortfolio} alt={displayName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-4xl">✂️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={pro.status} size="md" />
        </div>
        {pro.status_promo && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs font-medium text-primary-foreground bg-primary/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 truncate">
              🔥 {pro.status_promo}
            </p>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-card">
              {pro.avatar_url ? (
                <img src={pro.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-primary text-sm">{displayName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm flex items-center gap-1">{displayName} <RoleBadge role="pro" /></h3>
              <p className="text-xs text-muted-foreground">{categoryLabels[pro.category] || pro.category}</p>
            </div>
          </div>
          {pro.average_rating && Number(pro.average_rating) > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="font-semibold">{Number(pro.average_rating).toFixed(1)}</span>
              <span className="text-muted-foreground">({pro.total_reviews})</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{pro.city || "Nearby"}</span>
            {minPrice !== null && (
              <>
                <span>·</span>
                <span>From ${minPrice}</span>
              </>
            )}
          </div>
        </div>
        {pro.specialties && pro.specialties.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {pro.specialties.slice(0, 3).map(s => (
              <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{s}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
