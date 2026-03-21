import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProfessionalById, useReviewsForPro, useIsFavorite, useIsFollowing, useToggleFavorite, useToggleFollow } from "@/hooks/use-data";
import { StatusBadge } from "@/components/StatusBadge";
import { categoryLabels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, MapPin, Heart, Clock, CheckCircle2, Briefcase, Instagram, Globe, Users, ImageIcon, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { BookingSheet } from "@/components/BookingSheet";
import { toast } from "sonner";

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
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="flex items-end gap-4 -mt-10 px-2">
          <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1 pb-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Scissors className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display text-lg font-semibold">Professional not found</p>
          <p className="text-sm text-muted-foreground mt-1">This profile may have been removed or is unavailable.</p>
          <Link to="/home">
            <Button variant="outline" className="mt-4 rounded-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayName = pro.display_name || pro.business_name || pro.full_name;
  const firstPortfolio = pro.portfolio_items?.[0]?.media_url;
  const locationParts = [pro.shop_name, pro.address, pro.city, pro.state].filter(Boolean);
  const hasServices = pro.services && pro.services.length > 0;
  const hasPortfolio = pro.portfolio_items && pro.portfolio_items.length > 0;
  const hasReviews = reviews && reviews.length > 0;

  const handleFavorite = () => {
    if (!user) { toast.error("Sign in to save favorites"); return; }
    if (id) toggleFav.mutate(id);
  };

  const handleFollow = () => {
    if (!user) { toast.error("Sign in to follow professionals"); return; }
    if (id) toggleFollow.mutate(id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${displayName} on OpenChair`, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Cover */}
      <div className="relative h-56 bg-secondary overflow-hidden">
        {firstPortfolio ? (
          <img src={firstPortfolio} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-secondary to-accent/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link to="/home" className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex gap-2">
            <button onClick={handleShare} className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
              <Globe className="h-4 w-4" />
            </button>
            <button onClick={handleFavorite} className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
              <Heart className={cn("h-4 w-4 transition-colors", isFav && "fill-destructive text-destructive")} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-10">
        {/* Avatar + name */}
        <div className="flex items-end gap-4">
          <div className="h-22 w-22 rounded-2xl border-4 border-background shadow-lg bg-card flex items-center justify-center overflow-hidden" style={{ height: 88, width: 88 }}>
            {pro.avatar_url ? (
              <img src={pro.avatar_url} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                <span className="font-display font-bold text-3xl text-primary">{displayName.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="flex-1 pb-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-xl font-bold truncate">{displayName}</h1>
              {pro.is_verified && <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20 shrink-0" />}
            </div>
            <p className="text-sm text-muted-foreground">{categoryLabels[pro.category] || pro.category}</p>
          </div>
        </div>

        {/* Status + promo */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={pro.status} size="md" pulse />
          {pro.status_note && (
            <span className="text-xs text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full">{pro.status_note}</span>
          )}
        </div>

        {pro.status_promo && (
          <div className="mt-3 rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-start gap-2">
            <span className="text-base">🔥</span>
            <p className="text-sm font-medium text-primary">{pro.status_promo}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Rating", value: <span className="flex items-center justify-center gap-0.5"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{Number(pro.average_rating || 0).toFixed(1)}</span> },
            { label: "Reviews", value: pro.total_reviews || 0 },
            { label: "Followers", value: pro.follower_count || 0 },
            { label: "Experience", value: `${pro.years_experience || 0}yr` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center bg-card rounded-xl border border-border p-2.5">
              <p className="font-display font-bold text-sm">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        {pro.bio && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{pro.bio}</p>
          </div>
        )}

        {/* Location */}
        {locationParts.length > 0 && (
          <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{locationParts.join(" · ")}</span>
          </div>
        )}

        {/* Quick info chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pro.accepts_walk_ins && (
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-medium">Walk-ins welcome</span>
          )}
          {pro.is_mobile_service && (
            <span className="rounded-full bg-accent/20 text-accent-foreground px-2.5 py-0.5 text-[10px] font-medium">Mobile service</span>
          )}
          {pro.languages && pro.languages.length > 1 && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
              {pro.languages.join(", ")}
            </span>
          )}
        </div>

        {/* Specialties */}
        {pro.specialties && pro.specialties.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-1.5">
              {pro.specialties.map(s => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Social links */}
        {(pro.instagram_url || (pro as any).tiktok_url || (pro as any).website_url) && (
          <div className="mt-4 flex gap-2">
            {pro.instagram_url && (
              <a href={pro.instagram_url.startsWith("http") ? pro.instagram_url : `https://instagram.com/${pro.instagram_url.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="h-9 px-3 rounded-full bg-card border border-border flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-3.5 w-3.5" /> Instagram
              </a>
            )}
          </div>
        )}

        {/* Follow button */}
        <Button
          variant={isFollowing ? "outline" : "default"}
          className="mt-4 rounded-full w-full"
          onClick={handleFollow}
        >
          <Users className="h-4 w-4 mr-1" />
          {isFollowing ? "Following" : "Follow"}
        </Button>

        {/* Services */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">Services & Pricing</h2>
            {hasServices && <span className="text-xs text-muted-foreground">{pro.services!.length} services</span>}
          </div>
          {hasServices ? (
            <div className="space-y-2">
              {pro.services!.map((service: any) => (
                <div key={service.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-semibold text-sm">{service.service_name}</p>
                    {service.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>}
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration_minutes} min</span>
                      {service.instant_book && <span className="text-primary font-medium">⚡ Instant</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-base">${Number(service.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-xl border border-border">
              <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No services listed yet</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">This professional hasn't added their service menu.</p>
            </div>
          )}
        </section>

        {/* Portfolio */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">Portfolio</h2>
            {hasPortfolio && <span className="text-xs text-muted-foreground">{pro.portfolio_items!.length} photos</span>}
          </div>
          {hasPortfolio ? (
            <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
              {pro.portfolio_items!.map((item: any) => (
                <img key={item.id} src={item.media_url} alt={item.caption || "Portfolio"} className="aspect-square object-cover" loading="lazy" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-xl border border-border">
              <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No portfolio yet</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Check back soon for photos of their work.</p>
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">Reviews</h2>
            {hasReviews && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span>{Number(pro.average_rating || 0).toFixed(1)} ({pro.total_reviews})</span>
              </div>
            )}
          </div>
          {hasReviews ? (
            <div className="space-y-3">
              {reviews!.map((review: any) => (
                <div key={review.id} className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{(review.profiles?.full_name || "?").charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{review.profiles?.full_name || "Client"}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/20")} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {review.review_text && <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{review.review_text}</p>}
                  {review.tags && review.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {review.tags.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-primary/5 text-primary px-2 py-0.5 text-[10px] font-medium">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-xl border border-border">
              <Star className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No reviews yet</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Be the first to book and leave a review.</p>
            </div>
          )}
        </section>
      </div>

      {/* Sticky book bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 z-50">
        <Button size="lg" className="rounded-full w-full text-base font-semibold h-12" onClick={() => {
          if (!user) { toast.error("Sign in to book an appointment"); return; }
          setBookingOpen(true);
        }}>
          {["open-chair", "available-now"].includes(pro.status) ? "⚡ Book Now" : "Request Appointment"}
        </Button>
      </div>

      <BookingSheet
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        proProfileId={pro.id}
        proName={displayName}
        services={(pro.services || []) as any}
      />
    </div>
  );
}
