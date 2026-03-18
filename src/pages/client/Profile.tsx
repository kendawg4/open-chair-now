import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Settings, ChevronRight, Heart, Calendar, Star, Bell, LogOut, Scissors } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ClientProfile() {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-lg">Profile</h1>
          <button className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display font-bold text-xl text-primary">{initials}</span>
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">{profile?.full_name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{profile?.city || "Location not set"}</p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            { icon: Calendar, label: "My Bookings", to: "/home" },
            { icon: Heart, label: "Saved Professionals", to: "/favorites" },
            { icon: Star, label: "My Reviews", to: "/home" },
            { icon: Bell, label: "Notification Settings", to: "/home" },
          ].map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary transition-colors">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {role === "professional" && (
          <div className="border-t border-border pt-4">
            <Link to="/pro/dashboard" className="flex items-center gap-3 rounded-xl p-3 bg-primary/5 border border-primary/20">
              <Scissors className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Switch to Pro mode</p>
                <p className="text-xs text-muted-foreground">Manage your professional profile</p>
              </div>
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </div>
        )}

        <Button variant="ghost" className="w-full text-muted-foreground gap-2 mt-4" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
      <BottomNav role="client" />
    </div>
  );
}
