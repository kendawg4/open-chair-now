import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = [
  { value: "barber", label: "Barber", emoji: "✂️" },
  { value: "hairstylist", label: "Hairstylist", emoji: "💇‍♀️" },
  { value: "braider", label: "Braider", emoji: "🧶" },
  { value: "loc-specialist", label: "Loc Specialist", emoji: "🔒" },
  { value: "nail-tech", label: "Nail Tech", emoji: "💅" },
  { value: "esthetician", label: "Esthetician", emoji: "🧖‍♀️" },
  { value: "lash-tech", label: "Lash Tech", emoji: "👁️" },
  { value: "makeup-artist", label: "Makeup Artist", emoji: "💄" },
  { value: "tattoo-artist", label: "Tattoo Artist", emoji: "🎨" },
  { value: "piercer", label: "Piercer", emoji: "💎" },
] as const;

const businessTypes = [
  { value: "independent", label: "Independent" },
  { value: "booth-renter", label: "Booth/Suite Renter" },
  { value: "shop-employee", label: "Shop Employee" },
  { value: "shop-owner", label: "Shop Owner" },
] as const;

const specialtyOptions: Record<string, string[]> = {
  barber: ["fades", "tapers", "beard grooming", "kids cuts", "designs", "straight razor"],
  hairstylist: ["silk press", "blowout", "color", "balayage", "women's cuts", "men's cuts"],
  braider: ["knotless braids", "box braids", "cornrows", "twists", "crochet"],
  "loc-specialist": ["starter locs", "retwist", "loc maintenance", "loc styling"],
  "nail-tech": ["acrylics", "gel nails", "nail art", "manicure", "pedicure"],
  esthetician: ["facials", "waxing", "chemical peels", "microdermabrasion"],
  "lash-tech": ["lash extensions", "lash lift", "brow lamination"],
  "makeup-artist": ["bridal", "editorial", "everyday glam", "sfx"],
  "tattoo-artist": ["fine line", "black and gray", "color", "traditional", "geometric"],
  piercer: ["ear piercings", "nose piercings", "body piercings"],
};

export default function ProOnboarding() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [category, setCategory] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("independent");
  const [businessName, setBusinessName] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("");

  const toggleSpecialty = (s: string) => {
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleComplete = async () => {
    if (!profile || !category) return;
    setLoading(true);

    // Update profile
    await supabase.from("profiles").update({
      city,
      state: stateName,
      bio,
    }).eq("id", profile.id);

    // Create professional profile
    const { error } = await supabase.from("professional_profiles").insert({
      profile_id: profile.id,
      business_name: businessName || null,
      category: category as any,
      business_type: businessType as any,
      specialties,
      years_experience: parseInt(yearsExperience) || 0,
      shop_name: shopName || null,
      address: address || null,
      city: city || null,
      state: stateName || null,
      instagram_url: instagram || null,
      onboarding_completed: true,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      await refreshProfile();
      toast.success("Profile created! Welcome to OpenChair Pro!");
      navigate("/pro/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div>
          <p className="text-xs text-primary font-medium">Step {step} of 3</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn("h-1 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-secondary")} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold">What do you do?</h1>
              <p className="text-sm text-muted-foreground mt-1">Select your primary category</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-3.5 text-left transition-all",
                    category === cat.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
            <Button className="w-full rounded-xl" disabled={!category} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl font-bold">Your business</h1>
              <p className="text-sm text-muted-foreground mt-1">Tell clients about your setup</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {businessTypes.map(bt => (
                    <button
                      key={bt.value}
                      onClick={() => setBusinessType(bt.value)}
                      className={cn(
                        "rounded-xl border p-3 text-xs font-medium text-center transition-all",
                        businessType === bt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Business/Brand name (optional)</Label>
                <Input value={businessName} onChange={e => setBusinessName(e.target.value)} className="rounded-xl" placeholder="e.g. Marcus Cuts Studio" />
              </div>

              <div className="space-y-2">
                <Label>Shop/Studio name (optional)</Label>
                <Input value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-xl" placeholder="e.g. Elite Barbershop" />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} className="rounded-xl" placeholder="123 Main St" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl" placeholder="Brooklyn" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={stateName} onChange={e => setStateName(e.target.value)} className="rounded-xl" placeholder="NY" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Years of experience</Label>
                <Input type="number" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} className="rounded-xl" placeholder="5" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 rounded-xl" onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display text-2xl font-bold">Final details</h1>
              <p className="text-sm text-muted-foreground mt-1">Specialties & bio</p>
            </div>

            <div className="space-y-4">
              {category && specialtyOptions[category] && (
                <div className="space-y-2">
                  <Label>Your specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions[category].map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSpecialty(s)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                          specialties.includes(s)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary/30"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell clients about your style and experience..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Instagram (optional)</Label>
                <Input value={instagram} onChange={e => setInstagram(e.target.value)} className="rounded-xl" placeholder="@yourusername" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 rounded-xl" onClick={handleComplete} disabled={loading}>
                {loading ? "Creating..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
