import { useState, useEffect, useRef } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useMyProProfile, useUpdateStatus, useCreateService, useDeleteService, useUploadPortfolioItem, useDeletePortfolioItem } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Upload, Camera, CheckCircle2, X, DollarSign, Clock, Scissors, MapPin, Image as ImageIcon, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { geocodeAddress } from "@/hooks/use-geocode";
import { statusLabels, categoryLabels } from "@/lib/constants";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const STATUS_OPTIONS = [
  { value: "open-chair", color: "bg-status-available text-white" },
  { value: "available-now", color: "bg-status-available text-white" },
  { value: "last-minute", color: "bg-status-limited text-status-limited-foreground" },
  { value: "appointment-only", color: "bg-status-limited text-status-limited-foreground" },
  { value: "busy", color: "bg-status-busy text-white" },
  { value: "offline", color: "bg-status-offline text-status-offline-foreground" },
];

export default function ProfileEdit() {
  const { profile, refreshProfile } = useAuth();
  const { data: proProfile, isLoading } = useMyProProfile();
  const queryClient = useQueryClient();
  const updateStatus = useUpdateStatus();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const uploadPortfolio = useUploadPortfolioItem();
  const deletePortfolio = useDeletePortfolioItem();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  const [walkins, setWalkins] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [saving, setSaving] = useState(false);

  // Status fields
  const [statusNote, setStatusNote] = useState("");

  // New service fields
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceInstant, setNewServiceInstant] = useState(false);
  const [addingService, setAddingService] = useState(false);

  // Portfolio
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (proProfile) {
      setDisplayName((proProfile as any).display_name || proProfile.full_name || "");
      setBusinessName(proProfile.business_name || "");
      setShopName(proProfile.shop_name || "");
      setAddress(proProfile.address || "");
      setCity(proProfile.city || "");
      setStateName(proProfile.state || "");
      setBio(proProfile.bio || "");
      setInstagram(proProfile.instagram_url || "");
      setTiktok((proProfile as any).tiktok_url || "");
      setWebsite((proProfile as any).website_url || "");
      setWalkins(proProfile.accepts_walk_ins ?? true);
      setMobile(proProfile.is_mobile_service ?? false);
      setStatusNote(proProfile.status_note || "");
    }
  }, [proProfile]);

  const handleSaveProfile = async () => {
    if (!proProfile || !profile) return;
    if (!city.trim()) { toast.error("City is required"); return; }
    setSaving(true);
    try {
      // Geocode the address
      const coords = await geocodeAddress(address || null, city, stateName || null);

      const [profileRes, proRes] = await Promise.all([
        supabase.from("profiles").update({
          display_name: displayName || null,
          bio,
          city,
          state: stateName,
        }).eq("id", profile.id),
        supabase.from("professional_profiles").update({
          business_name: businessName || null,
          shop_name: shopName || null,
          address: address || null,
          city: city || null,
          state: stateName || null,
          latitude: coords?.latitude ?? proProfile.latitude,
          longitude: coords?.longitude ?? proProfile.longitude,
          instagram_url: instagram || null,
          tiktok_url: tiktok || null,
          website_url: website || null,
          accepts_walk_ins: walkins,
          is_mobile_service: mobile,
        }).eq("id", proProfile.id),
      ]);
      if (profileRes.error) throw profileRes.error;
      if (proRes.error) throw proRes.error;
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success(coords ? "Profile saved with updated location!" : "Profile saved!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    }
    setSaving(false);
  };

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ status, note: statusNote || undefined });
      toast.success(`Status updated to ${statusLabels[status]}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleAddService = async () => {
    if (!proProfile || !newServiceName.trim() || !newServicePrice) return;
    setAddingService(true);
    try {
      await createService.mutateAsync({
        professional_profile_id: proProfile.id,
        service_name: newServiceName.trim(),
        price: parseFloat(newServicePrice),
        duration_minutes: parseInt(newServiceDuration) || 30,
        description: newServiceDesc.trim() || undefined,
        instant_book: newServiceInstant,
      });
      setNewServiceName("");
      setNewServicePrice("");
      setNewServiceDuration("30");
      setNewServiceDesc("");
      setNewServiceInstant(false);
      setShowAddService(false);
      toast.success("Service added!");
    } catch (e: any) {
      toast.error(e.message || "Failed to add service");
    }
    setAddingService(false);
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service removed");
    } catch {
      toast.error("Failed to remove service");
    }
  };

  const handleUploadPortfolio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !proProfile) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    try {
      await uploadPortfolio.mutateAsync({ file, proProfileId: proProfile.id, caption: caption || undefined });
      setCaption("");
      toast.success("Image uploaded!");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deletePortfolio.mutateAsync(id);
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const ext = file.name.split(".").pop();
    const path = `${profile.user_id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file);
    if (uploadError) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error } = await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", profile.id);
    if (error) { toast.error("Failed to update avatar"); return; }
    await refreshProfile();
    queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
    toast.success("Avatar updated!");
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const initials = (proProfile?.full_name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display font-bold text-lg">Edit Profile</h1>
          <div className="flex-1" />
          <Button size="sm" className="rounded-xl" onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-6">

        {/* ===== AVATAR ===== */}
        <div className="flex items-center gap-4">
          <button onClick={() => avatarInputRef.current?.click()} className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {proProfile?.avatar_url ? (
                <img src={proProfile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-2xl text-primary">{initials}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div>
            <p className="font-display font-bold">{proProfile?.full_name}</p>
            <p className="text-xs text-muted-foreground">{categoryLabels[proProfile?.category || ""] || proProfile?.category}</p>
            <button onClick={() => avatarInputRef.current?.click()} className="text-xs text-primary font-medium mt-1">Change photo</button>
          </div>
        </div>

        {/* ===== STATUS ===== */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Live Status
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map(({ value, color }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-xs font-semibold transition-all border-2",
                  proProfile?.status === value
                    ? `${color} border-primary shadow-sm`
                    : "bg-card border-border text-foreground hover:border-primary/30"
                )}
              >
                {statusLabels[value]}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status note (optional)</Label>
            <Input
              value={statusNote}
              onChange={e => setStatusNote(e.target.value)}
              placeholder="e.g. Walk-ins welcome until 5 PM"
              className="rounded-xl text-sm"
              maxLength={100}
            />
          </div>
        </section>

        {/* ===== PROFILE INFO ===== */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-sm">Profile Info</h2>
          <div className="space-y-2">
            <Label className="text-xs">Display Name</Label>
            <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl" maxLength={60} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Business / Brand Name</Label>
            <Input value={businessName} onChange={e => setBusinessName(e.target.value)} className="rounded-xl" maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} className="rounded-xl resize-none" rows={3} maxLength={300} />
            <p className="text-[10px] text-muted-foreground text-right">{bio.length}/300</p>
          </div>
        </section>

        {/* ===== LOCATION ===== */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Location
          </h2>
          <div className="space-y-2">
            <Label className="text-xs">Shop / Studio Name</Label>
            <Input value={shopName} onChange={e => setShopName(e.target.value)} className="rounded-xl" maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">City</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">State</Label>
              <Input value={stateName} onChange={e => setStateName(e.target.value)} className="rounded-xl" maxLength={2} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Accepts walk-ins</Label>
            <Switch checked={walkins} onCheckedChange={setWalkins} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Mobile / travel service</Label>
            <Switch checked={mobile} onCheckedChange={setMobile} />
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm flex items-center gap-2">
              <Scissors className="h-4 w-4 text-primary" /> Services & Pricing
            </h2>
            <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1" onClick={() => setShowAddService(true)}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>

          {proProfile?.services?.length ? (
            <div className="space-y-2">
              {proProfile.services.map((s: any) => (
                <div key={s.id} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.service_name}</p>
                    <p className="text-[11px] text-muted-foreground">{s.duration_minutes} min{s.instant_book && " · Instant book"}</p>
                  </div>
                  <p className="font-display font-bold text-sm">${Number(s.price)}</p>
                  <button onClick={() => handleDeleteService(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No services yet. Add your menu so clients can book.</p>
          )}

          {/* Add service form */}
          {showAddService && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold text-sm">New Service</p>
                <button onClick={() => setShowAddService(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <Input placeholder="Service name" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="rounded-xl" maxLength={60} />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input type="number" min="0" step="5" placeholder="Price" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="rounded-xl pl-8" />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input type="number" min="5" step="5" placeholder="Minutes" value={newServiceDuration} onChange={e => setNewServiceDuration(e.target.value)} className="rounded-xl pl-8" />
                </div>
              </div>
              <Textarea placeholder="Description (optional)" value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)} className="rounded-xl resize-none" rows={2} maxLength={200} />
              <div className="flex items-center justify-between">
                <Label className="text-xs">Instant book</Label>
                <Switch checked={newServiceInstant} onCheckedChange={setNewServiceInstant} />
              </div>
              <Button className="w-full rounded-xl" onClick={handleAddService} disabled={addingService || !newServiceName.trim() || !newServicePrice}>
                {addingService ? "Adding..." : "Add Service"}
              </Button>
            </div>
          )}
        </section>

        {/* ===== PORTFOLIO ===== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" /> Portfolio
            </h2>
            <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPortfolio} />

          {proProfile?.portfolio_items?.length ? (
            <div className="grid grid-cols-3 gap-2">
              {proProfile.portfolio_items.map((item: any) => (
                <div key={item.id} className="relative group overflow-hidden rounded-xl border border-border">
                  <img src={item.media_url} alt={item.caption || "Portfolio"} className="aspect-square w-full object-cover" />
                  <button
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Upload photos of your work to attract clients.</p>
          )}
        </section>

        {/* ===== SOCIAL LINKS ===== */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-sm">Social Links</h2>
          <div className="space-y-2">
            <Label className="text-xs">Instagram</Label>
            <Input value={instagram} onChange={e => setInstagram(e.target.value)} className="rounded-xl" placeholder="@username or URL" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">TikTok</Label>
            <Input value={tiktok} onChange={e => setTiktok(e.target.value)} className="rounded-xl" placeholder="@username or URL" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Website</Label>
            <Input value={website} onChange={e => setWebsite(e.target.value)} className="rounded-xl" placeholder="https://" />
          </div>
        </section>

        {/* ===== SAVE BUTTON ===== */}
        <Button className="w-full rounded-xl" size="lg" onClick={handleSaveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
