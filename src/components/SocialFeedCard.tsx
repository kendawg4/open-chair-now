import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { categoryLabels } from "@/lib/constants";
import { Heart, MessageCircle, Repeat2, Share2, Send, Pin, PinOff } from "lucide-react";
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
  onPin?: (postId: string) => void;
  onUnpin?: (postId: string) => void;
}

export function SocialFeedCard({ post, isLiked: initialLiked, isReposted: initialReposted, isOwner, onPin, onUnpin }: SocialFeedCardProps) {
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
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    try {
      if (newLiked) {
        await supabase.from("post_likes").insert({ post_id: post.id, profile_id: profile.id });
      } else {
        await supabase.from("post_likes").delete().eq("post_id", post.id).eq("profile_id", profile.id);
      }
      // Update post likes_count
      await supabase.from("posts").update({ likes_count: newLiked ? likesCount + 1 : likesCount - 1 } as any).eq("id", post.id);
    } catch {
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
    }
  };

  const handleRepost = async () => {
    if (!user || !profile) { toast.error("Sign in to repost"); return; }
    const newReposted = !reposted;
    setReposted(newReposted);
    setRepostCount((prev: number) => newReposted ? prev + 1 : prev - 1);
    try {
      if (newReposted) {
        await supabase.from("reposts").insert({ post_id: post.id, profile_id: profile.id });
        toast.success("Reposted!");
      } else {
        await supabase.from("reposts").delete().eq("post_id", post.id).eq("profile_id", profile.id);
      }
    } catch {
      setReposted(!newReposted);
      setRepostCount((prev: number) => newReposted ? prev - 1 : prev + 1);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from("comments")
      .select("*, profiles:profile_id(full_name, avatar_url)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true })
      .limit(20);
    setComments(data || []);
    setLoadingComments(false);
  };

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
            {post.pro_status && <StatusBadge status={post.pro_status} size="sm" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {post.pro_category ? categoryLabels[post.pro_category] || post.pro_category : ""} · {timeAgo(post.created_at)}
          </p>
        </div>
      </Link>

      {/* Content */}
      <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full aspect-square object-cover" />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
        <button onClick={handleLike} className={cn(
          "flex items-center gap-1.5 transition-colors",
          liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
        )}>
          <Heart className={cn("h-5 w-5", liked && "fill-current")} />
          <span className="text-xs font-medium">{likesCount}</span>
        </button>

        <button onClick={toggleComments} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className={cn("h-5 w-5", showComments && "text-primary")} />
          <span className="text-xs font-medium">{(post as any).comment_count || comments.length || ""}</span>
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

      {/* Comments section */}
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
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    {c.profiles?.avatar_url ? (
                      <img src={c.profiles.avatar_url} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-primary">{(c.profiles?.full_name || "?").charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-semibold">{c.profiles?.full_name || "User"}</span>{" "}
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
