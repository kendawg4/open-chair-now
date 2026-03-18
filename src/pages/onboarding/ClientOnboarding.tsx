import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const interests = ["Barber", "Hairstylist", "Braider", "Nails", "Lashes", "Esthetician", "Makeup", "Tattoo", "Piercer"];

export default function ClientOnboarding() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        city: city || null,
        bio: selectedInterests.length > 0 ? `Interested in: ${selectedInterests.join(", ")}` : null,
      })
      .eq("id", profile.id);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      await refreshProfile();
      toast.success("Welcome to OpenChair!");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div>
          <p className="text-xs text-primary font-medium">Step 1 of 1</p>
          <h1 className="font-display text-2xl font-bold mt-1">Set up your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Help us find the best pros for you</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your city</Label>
            <Input
              placeholder="e.g. Brooklyn, NY"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>What are you looking for?</Label>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors",
                    selectedInterests.includes(interest)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full rounded-xl" onClick={handleComplete} disabled={loading}>
            {loading ? "Saving..." : "Get Started"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/home")}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
