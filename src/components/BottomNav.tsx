import { Home, MapPin, Search, Heart, User, LayoutDashboard, Calendar, Scissors, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMode } from "@/lib/mode-context";
import { useUnreadCount } from "@/hooks/use-messaging";

const clientNav = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/discover", icon: MapPin, label: "Discover" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/favorites", icon: Heart, label: "Saved" },
  { to: "/profile", icon: User, label: "Profile" },
];

const proNav = [
  { to: "/pro/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pro/bookings", icon: Calendar, label: "Bookings" },
  { to: "/messages", icon: MessageCircle, label: "Messages" },
  { to: "/pro/services", icon: Scissors, label: "Services" },
  { to: "/pro/my-profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const { mode } = useMode();
  const { count: unreadCount } = useUnreadCount();

  const nav = mode === "pro" ? proNav : clientNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {nav.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          const showBadge = to === "/messages" && unreadCount > 0;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
