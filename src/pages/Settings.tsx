import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Bell, Shield, HelpCircle, ChevronRight, User, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const items = [
    { icon: User, label: "Edit Profile", to: role === "professional" ? "/pro/profile-edit" : "/profile" },
    { icon: Bell, label: "Notification Preferences", to: "/notifications" },
    { icon: Shield, label: "Privacy & Security", to: "#" },
    { icon: HelpCircle, label: "Help & Support", to: "#" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to={role === "professional" ? "/pro/dashboard" : "/profile"}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">Settings</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-1">
        {items.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 rounded-xl p-3.5 hover:bg-secondary transition-colors"
          >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}

        <div className="pt-6">
          <Button variant="ghost" className="w-full text-muted-foreground gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <BottomNav role={role === "professional" ? "pro" : "client"} />
    </div>
  );
}
