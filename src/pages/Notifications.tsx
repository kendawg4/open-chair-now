import { BottomNav } from "@/components/BottomNav";
import { useNotifications, useMarkNotificationRead } from "@/hooks/use-data";
import { useMode } from "@/lib/mode-context";
import { ArrowLeft, Bell, BellOff, Heart, MessageCircle, CalendarDays, UserPlus, Armchair } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

function getNotificationIcon(type: string) {
  switch (type) {
    case "post_like": return <Heart className="h-4 w-4" />;
    case "post_comment": return <MessageCircle className="h-4 w-4" />;
    case "new_booking": return <CalendarDays className="h-4 w-4" />;
    case "new_follower": return <UserPlus className="h-4 w-4" />;
    case "open_chair": return <Armchair className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
}

function getNotificationRoute(type: string, relatedId: string | null): string | null {
  if (!relatedId) return null;
  switch (type) {
    case "post_like":
    case "post_comment":
      // relatedId is the post id — route to the pro profile (post is on their feed)
      // We'll handle this with a dedicated post route or pro profile
      return null; // handled specially below
    case "new_booking":
    case "booking_update":
      return null; // handled specially
    case "new_follower":
      return `/profile/${relatedId}`;
    case "open_chair":
      return `/pro/${relatedId}`;
    default:
      return null;
  }
}

export default function Notifications() {
  const { mode } = useMode();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const navigate = useNavigate();

  const handleNotificationClick = async (n: any) => {
    if (!n.is_read) {
      markRead.mutate(n.id);
    }

    const relatedId = n.related_entity_id;
    if (!relatedId) return;

    switch (n.type) {
      case "post_like":
      case "post_comment":
        // relatedId is post id — find the pro profile that owns it, navigate there
        try {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data: post } = await supabase
            .from("posts")
            .select("professional_profile_id")
            .eq("id", relatedId)
            .single();
          if (post) {
            navigate(`/pro/${post.professional_profile_id}`);
          }
        } catch { /* ignore */ }
        return;
      case "new_booking":
      case "booking_update":
        navigate(mode === "pro" ? `/pro/bookings?highlight=${relatedId}` : `/bookings?highlight=${relatedId}`);
        return;
      case "new_follower":
        navigate(`/profile/${relatedId}`);
        return;
      case "open_chair":
        navigate(`/pro/${relatedId}`);
        return;
      default:
        return;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to={mode === "pro" ? "/pro/dashboard" : "/home"}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">Notifications</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-display font-semibold text-sm">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">You'll see updates here</p>
          </div>
        ) : (
          notifications.map((n: any) => (
            <button
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={cn(
                "w-full text-left rounded-xl border p-3.5 transition-colors",
                n.is_read ? "bg-card border-border" : "bg-primary/5 border-primary/20",
                n.related_entity_id ? "cursor-pointer active:scale-[0.98]" : "cursor-default"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  n.is_read ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                  {getNotificationIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
