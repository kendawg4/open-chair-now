import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useProfessionalById, useReviewsForPro, useIsFavorite, useIsFollowing, useToggleFavorite, useToggleFollow, useTogglePinPost, useUnpinPost } from "@/hooks/use-data";
import { StatusBadge } from "@/components/StatusBadge";
import { SocialFeedCard } from "@/components/SocialFeedCard";
import { OpenChairToggle } from "@/components/OpenChairToggle";
import { CreatePostSheet } from "@/components/CreatePostSheet";
import { categoryLabels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin, Heart, Clock, CheckCircle2, Briefcase, Instagram, Globe, Users, ImageIcon, Scissors, Grid3X3, Newspaper, MessageCircle, Edit2, PenSquare, Plus, Settings } from "lucide-react";
import { RoleBadge } from "@/components/RoleBadge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { BookingSheet } from "@/components/BookingSheet";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useStartConversation } from "@/hooks/use-messaging";

function useProPosts(proProfileId: string | undefined) {
  return useQuery({
    queryKey: ["proPosts", proProfileId],
    queryFn: async () => {
      if (!proProfileId) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("professional_profile_id", proProfileId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!proProfileId,
  });
}

export default function ProProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("posts");
  const { user, profile: myProfile, proProfileId } = useAuth();
  const { data: pro, isLoading } = useProfessionalById(id);
  const { data: reviews } = useReviewsForPro(id);
  const { data: posts } = useProPosts(id);
  const { data: isFav } = useIsFavorite(id);
  const { data: isFollowing } = useIsFollowing(id);
  const toggleFav = useToggleFavorite();
  const toggleFollow = useToggleFollow();
  const pinPost = useTogglePinPost();
  const unpinPost = useUnpinPost();
  const startConversation = useStartConversation();
  const isOwnProfile = proProfileId === id;
  const [postSheetOpen, setPostSheetOpen] = useState(false);

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
          <p className="text-sm text-muted-foreground mt-1">This profile may have been removed.</p>
          <Link to="/home"><Button variant="outline" className="mt-4 rounded-full">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const displayName = pro.display_name || pro.business_name || pro.full_name;
  const firstPortfolio = pro.portfolio_items?.[0]?.media_url;
  const locationParts = [pro.shop_name, pro.city, pro.state].filter(Boolean);
  const hasServices = pro.services && pro.services.length > 0;
  const hasPortfolio = pro.portfolio_items && pro.portfolio_items.length > 0;
  const hasReviews = reviews && reviews.length > 0;
  const hasPosts = posts && posts.length > 0;

  const handleFavorite = () => {
    if (!user) { toast.error("Sign in to save favorites"); return; }
    if (id) toggleFav.mutate(id);
  };

  const handleFollow = () => {
    if (!user) { toast.error("Sign in to follow"); return; }
    if (id) toggleFollow.mutate(id);
  };

  const handleMessage = async () => {
    if (!user) { toast.error("Sign in to message"); return; }
    if (!pro?.profile_id) return;
    try {
      const convId = await startConversation.mutateAsync(pro.profile_id);
      navigate(`/messages/${convId}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to start conversation");
    }
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
      <div className="relative h-48 bg-secondary overflow-hidden">
        {firstPortfolio ? (
          <img src={firstPortfolio} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-secondary to-accent/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          {isOwnProfile ? (
            <div />
          ) : (
            <Link to="/home" className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <Link to="/pro/profile-edit" className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
                  <Edit2 className="h-4 w-4" />
                </Link>
                <Link to="/settings" className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
                  <Settings className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <button onClick={handleShare} className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
                  <Globe className="h-4 w-4" />
                </button>
                <button onClick={handleFavorite} className="h-9 w-9 rounded-full glass flex items-center justify-center backdrop-blur-md">
                  <Heart className={cn("h-4 w-4 transition-colors", isFav && "fill-destructive text-destructive")} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 relative z-10">
        {/* Avatar + info */}
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
              <RoleBadge role="pro" size="md" />
              {pro.is_verified && <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20 shrink-0" />}
            </div>
            <p className="text-sm text-muted-foreground">{categoryLabels[pro.category] || pro.category}</p>
          </div>
        </div>

        {/* Status badge - prominent */}
        <div className="mt-3 flex items-center gap-2">
          <StatusBadge status={pro.status} size="md" pulse />
          {pro.status_note && (
            <span className="text-xs text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full">{pro.status_note}</span>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <Link to={`/pro/followers/${pro.id}`} className="hover:underline"><strong>{pro.follower_count || 0}</strong> <span className="text-muted-foreground">followers</span></Link>
          <span><strong>{pro.total_reviews || 0}</strong> <span className="text-muted-foreground">reviews</span></span>
          <span className="flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-accent text-accent" /><strong>{Number(pro.average_rating || 0).toFixed(1)}</strong></span>
        </div>

        {/* Bio */}
        {pro.bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{pro.bio}</p>}

        {/* Location */}
        {locationParts.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{locationParts.join(" · ")}</span>
          </div>
        )}

        {/* Owner: Open Chair Toggle */}
        {isOwnProfile && (
          <div className="mt-4">
            <OpenChairToggle currentStatus={pro.status} />
          </div>
        )}

        {/* Owner: Create Post CTA */}
        {isOwnProfile && (
          <button
            onClick={() => setPostSheetOpen(true)}
            className="mt-3 w-full flex items-center gap-3 rounded-2xl bg-card border border-border p-4 hover:border-primary/30 transition-colors text-left"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {pro.avatar_url ? (
                <img src={pro.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-primary text-sm">{displayName.charAt(0)}</span>
              )}
            </div>
            <span className="text-sm text-muted-foreground flex-1">Share an update, promo, or photo...</span>
            <PenSquare className="h-5 w-5 text-primary" />
          </button>
        )}

        {/* Action buttons - only for visitors */}
        {!isOwnProfile && (
          <div className="mt-4 flex gap-2">
            <Button
              variant={isFollowing ? "outline" : "default"}
              className="flex-1 rounded-full"
              onClick={handleFollow}
            >
              <Users className="h-4 w-4 mr-1" />
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={handleMessage}
              disabled={startConversation.isPending}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => {
                if (!user) { toast.error("Sign in to book"); return; }
                setBookingOpen(true);
              }}
            >
              {["open-chair", "available-now"].includes(pro.status) ? "⚡ Book Now" : "Book"}
            </Button>
          </div>
        )}

        {/* Owner: Quick links */}
        {isOwnProfile && (
          <div className="mt-3 flex gap-2 flex-wrap">
            <Link to="/pro/profile-edit" className="h-8 px-3 rounded-full bg-card border border-border flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Edit2 className="h-3.5 w-3.5" /> Edit Profile
            </Link>
            <Link to="/pro/services" className="h-8 px-3 rounded-full bg-card border border-border flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Scissors className="h-3.5 w-3.5" /> Manage Services
            </Link>
            <Link to="/pro/portfolio" className="h-8 px-3 rounded-full bg-card border border-border flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ImageIcon className="h-3.5 w-3.5" /> Portfolio
            </Link>
          </div>
        )}

        {/* Social links */}
        {(pro.instagram_url) && (
          <div className="mt-3 flex gap-2">
            {pro.instagram_url && (
              <a href={pro.instagram_url.startsWith("http") ? pro.instagram_url : `https://instagram.com/${pro.instagram_url.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="h-8 px-3 rounded-full bg-card border border-border flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-3.5 w-3.5" /> Instagram
              </a>
            )}
          </div>
        )}

        {/* Tabbed content: Posts / Services / Portfolio / Reviews */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
          <TabsList className="w-full bg-secondary rounded-xl h-10">
            <TabsTrigger value="posts" className="flex-1 rounded-lg text-xs gap-1">
              <Newspaper className="h-3.5 w-3.5" /> Posts
            </TabsTrigger>
            <TabsTrigger value="services" className="flex-1 rounded-lg text-xs gap-1">
              <Scissors className="h-3.5 w-3.5" /> Services
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex-1 rounded-lg text-xs gap-1">
              <Grid3X3 className="h-3.5 w-3.5" /> Work
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 rounded-lg text-xs gap-1">
              <Star className="h-3.5 w-3.5" /> Reviews
            </TabsTrigger>
          </TabsList>

          {/* POSTS TAB - Social feed */}
          <TabsContent value="posts" className="mt-4 space-y-4">
            {!hasPosts ? (
              <div className="text-center py-8 bg-card rounded-2xl border border-border">
                <Newspaper className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No posts yet</p>
              </div>
            ) : (
              [...posts!]
                .sort((a: any, b: any) => {
                  if (a.is_pinned && !b.is_pinned) return -1;
                  if (!a.is_pinned && b.is_pinned) return 1;
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                })
                .map((post: any) => (
                  <SocialFeedCard
                    key={post.id}
                    post={{
                      ...post,
                      pro_name: displayName,
                      pro_avatar: pro.avatar_url,
                      pro_category: pro.category,
                      pro_status: pro.status,
                    }}
                    isOwner={isOwnProfile}
                    onPin={(postId) => pinPost.mutate(postId)}
                    onUnpin={(postId) => unpinPost.mutate(postId)}
                  />
                ))
            )}
          </TabsContent>

          {/* SERVICES TAB - Bookable services */}
          <TabsContent value="services" className="mt-4 space-y-2">
            {!hasServices ? (
              <div className="text-center py-8 bg-card rounded-2xl border border-border">
                <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No services listed yet</p>
              </div>
            ) : (
              pro.services!.map((service: any) => (
                <div key={service.id} className="rounded-xl bg-card border border-border p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-semibold text-sm">{service.service_name}</p>
                    {service.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>}
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration_minutes} min</span>
                      {service.instant_book && <span className="text-primary font-medium">⚡ Instant</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <p className="font-display font-bold text-base">${Number(service.price)}</p>
                    <Button
                      size="sm"
                      className="rounded-full text-xs h-7 px-3"
                      onClick={() => {
                        if (!user) { toast.error("Sign in to book"); return; }
                        setBookingOpen(true);
                      }}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* PORTFOLIO TAB */}
          <TabsContent value="portfolio" className="mt-4">
            {!hasPortfolio ? (
              <div className="text-center py-8 bg-card rounded-2xl border border-border">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No portfolio yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                {pro.portfolio_items!.map((item: any) => (
                  <img key={item.id} src={item.media_url} alt={item.caption || "Portfolio"} className="aspect-square object-cover" loading="lazy" />
                ))}
              </div>
            )}
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews" className="mt-4 space-y-3">
            {!hasReviews ? (
              <div className="text-center py-8 bg-card rounded-2xl border border-border">
                <Star className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              </div>
            ) : (
              reviews!.map((review: any) => (
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
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky book bar - for visitors or own profile viewed from client context */}
      {!isOwnProfile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 z-50">
          <Button size="lg" className="rounded-full w-full text-base font-semibold h-12" onClick={() => {
            if (!user) { toast.error("Sign in to book an appointment"); return; }
            setBookingOpen(true);
          }}>
            {["open-chair", "available-now"].includes(pro.status) ? "⚡ Book Now" : "Request Appointment"}
          </Button>
        </div>
      )}

      {/* Owner: FAB for creating post */}
      {isOwnProfile && (
        <button
          onClick={() => setPostSheetOpen(true)}
          className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Bottom nav - always show, respect current browsing context */}
      <BottomNav />

      <BookingSheet
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        proProfileId={pro.id}
        proName={displayName}
        services={(pro.services || []) as any}
      />

      {isOwnProfile && (
        <CreatePostSheet
          open={postSheetOpen}
          onOpenChange={setPostSheetOpen}
          proProfileId={pro.id}
        />
      )}
    </div>
  );
}
