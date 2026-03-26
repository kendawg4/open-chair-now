import { BottomNav } from "@/components/BottomNav";
import { useNotifications, useMarkNotificationRead } from "@/hooks/use-data";
import { useMode } from "@/lib/mode-context";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const { mode } = useMode();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to={role === "professional" ? "/pro/dashboard" : "/home"}>
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
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={cn(
                "w-full text-left rounded-xl border p-3.5 transition-colors",
                n.is_read ? "bg-card border-border" : "bg-primary/5 border-primary/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  n.is_read ? "bg-secondary" : "bg-primary/10"
                )}>
                  <Bell className={cn("h-4 w-4", n.is_read ? "text-muted-foreground" : "text-primary")} />
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
