import { useState, useEffect } from "react";
import { StatusBadge } from "./StatusBadge";
import { categoryLabels } from "@/lib/constants";
import { Heart, MessageCircle, Repeat2, Share2, Send, Pin, PinOff } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface SocialFeedCardProps {
  post: {
    id: string;
    content: string;
    image_url?: string | null;
    post_type: string;
    likes_count: number | null;
    comment_count?: number | null;
    repost_count?: number | null;
    created_at: string;
    professional_profile_id: string;
    pro_name?: string;
    pro_avatar?: string | null;
    pro_category?: string;
    pro_status?: string;
    is_pinned?: boolean;
  };
  isLiked?: boolean;
  isReposted?: boolean;
  isOwner?: boolean;
  highlight?: boolean;
  onPin?: (postId: string) => void;
  onUnpin?: (postId: string) => void;
}

export function SocialFeedCard({ post, isLiked: initialLiked, isReposted: initialReposted, isOwner, highlight, onPin, onUnpin }: SocialFeedCardProps) {
  const [isHighlighted, setIsHighlighted] = useState(highlight || false);

  useEffect(() => {
    if (highlight) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [highlight]);
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(initialLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [reposted, setReposted] = useState(initialReposted || false);
  const [repostCount, setRepostCount] = useState((post as any).repost_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);

  // Sync initial liked/reposted state from props
  useEffect(() => { setLiked(initialLiked || false); }, [initialLiked]);
  useEffect(() => { setReposted(initialReposted || false); }, [initialReposted]);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const handleLike = async () => {
    if (!user || !profile) { toast.error("Sign in to like"); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    try {
      if (newLiked) {
        // Use upsert with onConflict to prevent duplicates
        const { error } = await supabase.from("post_likes").upsert(
          { post_id: post.id, profile_id: profile.id },
          { onConflict: "post_id,profile_id", ignoreDuplicates: true }
        );
        if (!error) {
          // Only notify if this is a genuinely new like (no prior notification for this like)
          const { data: postData } = await supabase
            .from("posts")
            .select("professional_profile_id")
            .eq("id", post.id)
            .single();
          if (postData) {
            const { data: proProfile } = await supabase
              .from("professional_profiles")
              .select("profile_id")
              .eq("id", postData.professional_profile_id)
              .single();
            if (proProfile) {
              const { data: ownerProfile } = await supabase
                .from("profiles")
                .select("user_id")
                .eq("id", proProfile.profile_id)
                .single();
              if (ownerProfile && ownerProfile.user_id !== user.id) {
                // Check if a like notification already exists for this post+user combo
                const { data: existingNotif } = await supabase
                  .from("notifications")
                  .select("id")
                  .eq("user_id", ownerProfile.user_id)
                  .eq("type", "post_like")
                  .eq("related_entity_id", post.id)
                  .ilike("title", `%${(profile.display_name || profile.full_name).substring(0, 20)}%`)
                  .maybeSingle();
                if (!existingNotif) {
                  await supabase.from("notifications").insert({
                    user_id: ownerProfile.user_id,
                    type: "post_like",
                    title: `${profile.display_name || profile.full_name} liked your post`,
                    body: post.content.substring(0, 100),
                    related_entity_id: post.id,
                  });
                }
              }
            }
          }
        }
      } else {
        await supabase.from("post_likes").delete().eq("post_id", post.id).eq("profile_id", profile.id);
      }
      const { count } = await supabase
        .from("post_likes")
        .select("id", { count: "exact", head: true })
        .eq("post_id", post.id);
      const actualCount = count || 0;
      setLikesCount(actualCount);
      await supabase.from("posts").update({ likes_count: actualCount } as any).eq("id", post.id);
    } catch {
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleRepost = async () => {
    if (!user || !profile) { toast.error("Sign in to repost"); return; }
    const newReposted = !reposted;
    setReposted(newReposted);
    setRepostCount((prev: number) => newReposted ? prev + 1 : prev - 1);
    try {
      if (newReposted) {
        const { error } = await supabase.from("reposts").upsert(
          { post_id: post.id, profile_id: profile.id },
          { onConflict: "post_id,profile_id", ignoreDuplicates: true }
        );
        if (!error) toast.success("Reposted!");
      } else {
        await supabase.from("reposts").delete().eq("post_id", post.id).eq("profile_id", profile.id);
      }
      const { count } = await supabase
        .from("reposts")
        .select("id", { count: "exact", head: true })
        .eq("post_id", post.id);
      const actualCount = count || 0;
      setRepostCount(actualCount);
      await supabase.from("posts").update({ repost_count: actualCount } as any).eq("id", post.id);
    } catch {
      setReposted(!newReposted);
      setRepostCount((prev: number) => newReposted ? prev - 1 : prev + 1);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from("comments")
      .select("*, profiles:profile_id(id, full_name, display_name, avatar_url)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true })
      .limit(50);
    setComments(data || []);
    setCommentCount(data?.length || 0);
    setLoadingComments(false);
  };

  // Load preview comments on mount
  useEffect(() => {
    const loadPreview = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*, profiles:profile_id(id, full_name, display_name, avatar_url)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: false })
        .limit(2);
      if (data && data.length > 0) {
        setComments(data.reverse());
      }
      // Get accurate count
      const { count } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", post.id);
      setCommentCount(count || 0);
    };
    loadPreview();
  }, [post.id]);

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) loadComments();
  };

  const submitComment = async () => {
    if (!commentText.trim() || !profile) return;
    try {
      await supabase.from("comments").insert({
        post_id: post.id,
        profile_id: profile.id,
        content: commentText.trim(),
      });
      // Create notification for post owner
      const { data: postData } = await supabase
        .from("posts")
        .select("professional_profile_id")
        .eq("id", post.id)
        .single();
      if (postData) {
        const { data: proProfile } = await supabase
          .from("professional_profiles")
          .select("profile_id")
          .eq("id", postData.professional_profile_id)
          .single();
        if (proProfile) {
          const { data: ownerProfile } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("id", proProfile.profile_id)
            .single();
          if (ownerProfile && ownerProfile.user_id !== user?.id) {
            await supabase.from("notifications").insert({
              user_id: ownerProfile.user_id,
              type: "post_comment",
              title: `${profile.display_name || profile.full_name} commented on your post`,
              body: commentText.trim().substring(0, 100),
              related_entity_id: post.id,
            });
          }
        }
      }
      // Update comment_count from actual count
      const { count } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", post.id);
      const actualCount = count || 0;
      setCommentCount(actualCount);
      await supabase.from("posts").update({ comment_count: actualCount } as any).eq("id", post.id);
      setCommentText("");
      loadComments();
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    } catch {
      toast.error("Failed to comment");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/pro/${post.professional_profile_id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.pro_name || "Post", url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  return (
    <div className={cn("bg-card border rounded-2xl overflow-hidden", post.is_pinned ? "border-primary/40 ring-1 ring-primary/20" : "border-border")}>
      {/* Pinned indicator */}
      {post.is_pinned && (
        <div className="flex items-center gap-1.5 px-4 pt-2 text-xs text-primary font-medium">
          <Pin className="h-3 w-3" /> Pinned
        </div>
      )}
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <Link to={`/pro/${post.professional_profile_id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {post.pro_avatar ? (
            <img src={post.pro_avatar} alt={post.pro_name || ""} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display font-bold text-primary text-sm">{(post.pro_name || "?").charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
             <span className="font-display font-semibold text-sm">{post.pro_name || "Professional"}</span>
             <RoleBadge role="pro" />
            {post.pro_status && <StatusBadge status={post.pro_status} size="sm" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {post.pro_category ? categoryLabels[post.pro_category] || post.pro_category : ""} · {timeAgo(post.created_at)}
          </p>
        </div>
        </Link>
        {isOwner && (
          <button
            onClick={() => post.is_pinned ? onUnpin?.(post.id) : onPin?.(post.id)}
            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            title={post.is_pinned ? "Unpin" : "Pin to profile"}
          >
            {post.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full aspect-square object-cover" />
      )}

      {/* Comment preview (always visible if comments exist) */}
      {!showComments && comments.length > 0 && (
        <div className="px-4 pb-2 space-y-1.5">
          {comments.slice(0, 2).map((c: any) => (
            <div key={c.id} className="flex gap-1.5 items-start">
              <Link to={c.profiles?.id ? `/profile/${c.profiles.id}` : "#"} className="shrink-0">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {c.profiles?.avatar_url ? (
                    <img src={c.profiles.avatar_url} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[8px] font-bold text-primary">{(c.profiles?.full_name || "?").charAt(0)}</span>
                  )}
                </div>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-1">
                <Link to={c.profiles?.id ? `/profile/${c.profiles.id}` : "#"} className="font-semibold text-foreground hover:underline">
                  {c.profiles?.display_name || c.profiles?.full_name || "User"}
                </Link>{" "}
                {c.content}
              </p>
            </div>
          ))}
          {commentCount > 2 && (
            <button onClick={toggleComments} className="text-xs text-primary font-medium">
              View all {commentCount} comments
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
        <button onClick={handleLike} disabled={likeLoading} className={cn(
          "flex items-center gap-1.5 transition-colors",
          liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
        )}>
          <Heart className={cn("h-5 w-5", liked && "fill-current")} />
          <span className="text-xs font-medium">{likesCount}</span>
        </button>

        <button onClick={toggleComments} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className={cn("h-5 w-5", showComments && "text-primary")} />
          <span className="text-xs font-medium">{commentCount || ""}</span>
        </button>

        <button onClick={handleRepost} className={cn(
          "flex items-center gap-1.5 transition-colors",
          reposted ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}>
          <Repeat2 className={cn("h-5 w-5", reposted && "text-primary")} />
          <span className="text-xs font-medium">{repostCount || ""}</span>
        </button>

        <button onClick={handleShare} className="text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Comments section (expanded) */}
      {showComments && (
        <div className="border-t border-border/50 px-4 py-3 space-y-3">
          {loadingComments ? (
            <p className="text-xs text-muted-foreground">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-muted-foreground">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.map((c: any) => (
                <div key={c.id} className="flex gap-2">
                  <Link to={c.profiles?.id ? `/profile/${c.profiles.id}` : "#"} className="shrink-0">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {c.profiles?.avatar_url ? (
                        <img src={c.profiles.avatar_url} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-primary">{(c.profiles?.full_name || "?").charAt(0)}</span>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <Link to={c.profiles?.id ? `/profile/${c.profiles.id}` : "#"} className="font-semibold hover:underline">
                        {c.profiles?.display_name || c.profiles?.full_name || "User"}
                      </Link>{" "}
                      {c.content}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {user && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="rounded-full text-xs h-8"
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
              />
              <button onClick={submitComment} disabled={!commentText.trim()} className="text-primary disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
