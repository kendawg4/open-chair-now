import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProfessionalById, useReviewsForPro, useIsFavorite, useIsFollowing, useToggleFavorite, useToggleFollow } from "@/hooks/use-data";
import { StatusBadge } from "@/components/StatusBadge";
import { categoryLabels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, MapPin, Heart, Share2, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { BookingSheet } from "@/components/BookingSheet";

export default function ProProfile() {
  const { id } = useParams();
  const [bookingOpen, setBookingOpen] = useState(false);
  const { user } = useAuth();
  const { data: pro, isLoading } = useProfessionalById(id);
  const { data: reviews } = useReviewsForPro(id);
  const { data: isFav } = useIsFavorite(id);
  const { data: isFollowing } = useIsFollowing(id);
  const toggleFav = useToggleFavorite();
  const toggleFollow = useToggleFollow();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🤷</p>
          <p className="font-display font-semibold">Professional not found</p>
          <Link to="/home" className="text-primary text-sm mt-2 inline-block">Go back</Link>
        </div>
      </div>
    );
  }

  const displayName = pro.display_name || pro.business_name || pro.full_name;
  const firstPortfolio = pro.portfolio_items?.[0]?.media_url;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cover */}
      <div className="relative h-52 bg-secondary">
        {firstPortfolio && <img src={firstPortfolio} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link to="/home" className="h-9 w-9 rounded-full glass flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex gap-2">
            <button className="h-9 w-9 rounded-full glass flex items-center justify-center">
              <Share2 className="h-4 w-4" />
            </button>
            <button
              className="h-9 w-9 rounded-full glass flex items-center justify-center"
              onClick={() => id && toggleFav.mutate(id)}
            >
              <Heart className={cn("h-4 w-4", isFav && "fill-destructive text-destructive")} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-14 relative z-10">
        <div className="flex items-end gap-4">
          <div className="h-20 w-20 rounded-2xl border-4 border-background shadow-lg bg-primary/10 flex items-center justify-center overflow-hidden">
            {pro.avatar_url ? (
              <img src={pro.avatar_url} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display font-bold text-2xl text-primary">{displayName.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold">{displayName}</h1>
              {pro.is_verified && <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20" />}
            </div>
            <p className="text-sm text-muted-foreground">{categoryLabels[pro.category] || pro.category}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <StatusBadge status={pro.status} size="md" pulse />
          {pro.status_note && <span className="text-xs text-primary font-medium">{pro.status_note}</span>}
        </div>

        <div className="mt-4 flex gap-6">
          {[
            { label: "Rating", value: <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{Number(pro.average_rating || 0).toFixed(1)}</span> },
            { label: "Reviews", value: pro.total_reviews || 0 },
            { label: "Followers", value: pro.follower_count || 0 },
            { label: "Years", value: pro.years_experience || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-display font-bold text-sm">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {pro.bio && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{pro.bio}</p>}

        {(pro.shop_name || pro.address) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{[pro.shop_name, pro.address, pro.city].filter(Boolean).join(" · ")}</span>
          </div>
        )}

        {pro.status_promo && (
          <div className="mt-4 rounded-xl bg-primary/10 border border-primary/20 p-3">
            <p className="text-sm font-medium text-primary">🔥 {pro.status_promo}</p>
          </div>
        )}

        {pro.specialties && pro.specialties.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {pro.specialties.map(s => (
              <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{s}</span>
            ))}
          </div>
        )}

        {/* Follow button */}
        <Button
          variant={isFollowing ? "outline" : "default"}
          className="mt-4 rounded-full w-full"
          onClick={() => id && toggleFollow.mutate(id)}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>

        {/* Portfolio */}
        {pro.portfolio_items && pro.portfolio_items.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display font-bold text-base mb-3">Portfolio</h2>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
              {pro.portfolio_items.map((item: any) => (
                <img key={item.id} src={item.media_url} alt={item.caption || ""} className="aspect-square object-cover" />
              ))}
            </div>
          </section>
        )}

        {/* Services */}
        {pro.services && pro.services.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display font-bold text-base mb-3">Services & Pricing</h2>
            <div className="space-y-2">
              {pro.services.map((service: any) => (
                <div key={service.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-3.5">
                  <div>
                    <p className="font-semibold text-sm">{service.service_name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration_minutes} min</span>
                      {service.instant_book && <span className="text-primary font-medium">⚡ Instant book</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold">${Number(service.price)}</p>
                    <Button size="sm" variant="outline" className="mt-1 h-7 text-xs rounded-full">Book</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-6">
          <h2 className="font-display font-bold text-base mb-3">Reviews</h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review: any) => (
                <div key={review.id} className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{(review.profiles?.full_name || "?").charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{review.profiles?.full_name || "Client"}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.review_text && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.review_text}</p>}
                  {review.tags && review.tags.length > 0 && (
                    <div className="mt-2 flex gap-1.5">
                      {review.tags.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </section>
      </div>

      {/* Sticky book bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-4 z-50">
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="rounded-full flex-shrink-0">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button size="lg" className="rounded-full flex-1 text-base font-semibold">
            {["open-chair", "available-now"].includes(pro.status) ? "⚡ Book Now" : "Request Appointment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
