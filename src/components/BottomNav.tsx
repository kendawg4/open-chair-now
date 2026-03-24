import { Home, MapPin, Search, Heart, User, LayoutDashboard, Calendar, Image, Scissors, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

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

interface BottomNavProps {
  role?: "client" | "pro";
}

export function BottomNav({ role: roleProp }: BottomNavProps) {
  const location = useLocation();
  const { role: authRole } = useAuth();

  // Auto-detect role from auth context if not explicitly passed
  const effectiveRole = roleProp ?? (authRole === "professional" || authRole === "shop_owner" ? "pro" : "client");
  const nav = effectiveRole === "pro" ? proNav : clientNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {nav.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
