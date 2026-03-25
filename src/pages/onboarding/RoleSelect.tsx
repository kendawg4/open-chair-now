import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Scissors, User, MailCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function RoleSelect() {
  const { user, role, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"client" | "professional" | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  // Check email confirmation status
  useEffect(() => {
    if (user) {
      const confirmed = !!user.email_confirmed_at || !!user.confirmed_at;
      setEmailConfirmed(confirmed);
    }
  }, [user]);

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

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email sent! Check your inbox.");
    }
  };

  const handleRefreshStatus = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const confirmed = !!data.session.user.email_confirmed_at || !!data.session.user.confirmed_at;
      setEmailConfirmed(confirmed);
      if (confirmed) {
        toast.success("Email verified!");
      } else {
        toast("Email not verified yet. Check your inbox.");
      }
    }
  };

  const handleContinue = async () => {
    if (!selected || !user) return;

    if (!emailConfirmed) {
      toast.error("Please verify your email before continuing");
      return;
    }

    setLoading(true);

    // Check if role already exists to prevent duplicate key error
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
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

        {/* Email verification banner */}
        {user && !emailConfirmed && (
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MailCheck className="h-5 w-5 text-accent shrink-0" />
              <p className="text-sm font-semibold">Please verify your email before continuing</p>
            </div>
            <p className="text-xs text-muted-foreground">
              We sent a verification link to <strong>{user.email}</strong>. Check your inbox and click the link.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
                onClick={handleResendVerification}
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend email"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg text-xs"
                onClick={handleRefreshStatus}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> I've verified
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setSelected("client")}
            disabled={!emailConfirmed}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
              !emailConfirmed && "opacity-50 cursor-not-allowed",
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
            disabled={!emailConfirmed}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
              !emailConfirmed && "opacity-50 cursor-not-allowed",
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
          disabled={!selected || loading || !emailConfirmed}
          onClick={handleContinue}
        >
          {loading ? "Setting up..." : !emailConfirmed ? "Verify email to continue" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
