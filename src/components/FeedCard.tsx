import { StatusBadge } from "./StatusBadge";
import { categoryLabels } from "@/lib/constants";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface FeedCardProps {
  post: {
    id: string;
    content: string;
    image_url?: string | null;
    post_type: string;
    likes_count: number | null;
    created_at: string;
    professional_profile_id: string;
    pro_name?: string;
    pro_avatar?: string | null;
    pro_category?: string;
    pro_status?: string;
  };
}

export function FeedCard({ post }: FeedCardProps) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 pb-2">
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
      </div>

      <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full aspect-square object-cover" />
      )}

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">{post.likes_count || 0}</span>
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
