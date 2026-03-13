import { FeedPost } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { categoryLabels } from "@/data/mock";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface FeedCardProps {
  post: FeedPost;
}

export function FeedCard({ post }: FeedCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <Link to={`/pro/${post.proId}`}>
          <img src={post.proAvatar} alt={post.proName} className="h-10 w-10 rounded-full object-cover" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/pro/${post.proId}`} className="font-display font-semibold text-sm hover:underline">{post.proName}</Link>
            {post.status && <StatusBadge status={post.status} size="sm" />}
          </div>
          <p className="text-xs text-muted-foreground">{categoryLabels[post.proCategory]} · {post.timestamp}</p>
        </div>
      </div>

      {/* Text */}
      <p className="px-4 pb-3 text-sm leading-relaxed">{post.text}</p>

      {/* Image */}
      {post.image && (
        <img src={post.image} alt="" className="w-full aspect-square object-cover" />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">{post.likes}</span>
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
