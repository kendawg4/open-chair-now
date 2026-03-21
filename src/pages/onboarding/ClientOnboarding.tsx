import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const interests = ["Barber", "Hairstylist", "Braider", "Nails", "Lashes", "Esthetician", "Makeup", "Tattoo", "Piercer"];

export default function ClientOnboarding() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
        city: city.trim() || null,
        phone: phone.trim() || null,
        bio: selectedInterests.length > 0 ? `Interested in: ${selectedInterests.join(", ")}` : null,
      })
      .eq("id", profile.id);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      await refreshProfile();
      setDone(true);
      setTimeout(() => navigate("/home"), 1500);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome to OpenChair!</h1>
          <p className="text-sm text-muted-foreground">Taking you to discover nearby pros...</p>
        </div>
      </div>
    );
  }

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
            <Label>Phone number <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
          <Button className="w-full rounded-xl h-11" onClick={handleComplete} disabled={loading}>
            {loading ? "Saving..." : "Get Started"}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate("/home")}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
