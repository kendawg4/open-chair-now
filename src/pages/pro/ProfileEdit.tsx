import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useMyProProfile } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileEdit() {
  const { profile, refreshProfile } = useAuth();
  const { data: proProfile, isLoading } = useMyProProfile();
  const queryClient = useQueryClient();

  const [businessName, setBusinessName] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (proProfile) {
      setBusinessName(proProfile.business_name || "");
      setShopName(proProfile.shop_name || "");
      setAddress(proProfile.address || "");
      setCity(proProfile.city || "");
      setStateName(proProfile.state || "");
      setBio(proProfile.bio || "");
      setInstagram(proProfile.instagram_url || "");
    }
  }, [proProfile]);

  const handleSave = async () => {
    if (!proProfile || !profile) return;
    setSaving(true);

    await Promise.all([
      supabase.from("profiles").update({ bio, city, state: stateName }).eq("id", profile.id),
      supabase.from("professional_profiles").update({
        business_name: businessName || null,
        shop_name: shopName || null,
        address: address || null,
        city: city || null,
        state: stateName || null,
        instagram_url: instagram || null,
      }).eq("id", proProfile.id),
    ]);

    setSaving(false);
    await refreshProfile();
    queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
    toast.success("Profile updated!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Edit Profile</h1>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        <div className="space-y-2">
          <Label>Business / Brand name</Label>
          <Input value={businessName} onChange={e => setBusinessName(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Shop / Studio name</Label>
          <Input value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={address} onChange={e => setAddress(e.target.value)} className="rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input value={stateName} onChange={e => setStateName(e.target.value)} className="rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea value={bio} onChange={e => setBio(e.target.value)} className="rounded-xl resize-none" rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Instagram</Label>
          <Input value={instagram} onChange={e => setInstagram(e.target.value)} className="rounded-xl" placeholder="@username" />
        </div>

        <Button className="w-full rounded-xl" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <BottomNav role="pro" />
    </div>
  );
}
