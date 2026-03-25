import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Scissors, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function RoleSelect() {
  const { user, role, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"client" | "professional" | null>(null);
  const [loading, setLoading] = useState(false);

  // If user already has a role, skip this page
  useEffect(() => {
    if (role) {
      if (role === "professional" || role === "shop_owner") {
        navigate("/pro/dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [role, navigate]);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);

    // Check if role already exists to prevent duplicate key error
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Role already exists — just redirect
      await refreshProfile();
      setLoading(false);
      if (existing.role === "professional" || existing.role === "shop_owner") {
        navigate("/pro/dashboard");
      } else {
        navigate("/home");
      }
      return;
    }

    // Insert selected role
    const { error } = await supabase.from("user_roles").insert({
      user_id: user.id,
      role: selected,
    });

    // If signing up as professional, also add client role for dual capabilities
    if (selected === "professional") {
      await supabase.from("user_roles").insert({
        user_id: user.id,
        role: "client" as any,
      });
    }
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    if (selected === "professional") {
      navigate("/onboarding/pro");
    } else {
      navigate("/onboarding/client");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="font-display text-xl font-bold">Open<span className="text-primary">Chair</span></p>
          <h1 className="font-display text-2xl font-bold mt-4">How will you use OpenChair?</h1>
          <p className="text-sm text-muted-foreground mt-1">You can always switch later</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setSelected("client")}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
              selected === "client"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/30"
            )}
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold">I'm looking for a pro</p>
              <p className="text-xs text-muted-foreground mt-0.5">Find barbers, stylists, and beauty professionals</p>
            </div>
          </button>

          <button
            onClick={() => setSelected("professional")}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
              selected === "professional"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/30"
            )}
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold">I'm a professional</p>
              <p className="text-xs text-muted-foreground mt-0.5">Barber, stylist, braider, nail tech, and more</p>
            </div>
          </button>
        </div>

        <Button
          className="w-full rounded-xl"
          disabled={!selected || loading}
          onClick={handleContinue}
        >
          {loading ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
