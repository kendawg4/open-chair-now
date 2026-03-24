import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function ClientProfileEdit() {
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");

  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

      setAvatarPreview(avatarUrl);
      await refreshProfile();
      toast.success("Avatar updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !fullName.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["clientStats"] });
      toast.success("Profile updated!");
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-display font-bold text-base">Edit Profile</h1>
          <Button
            size="sm"
            className="rounded-full px-5"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </header>

      <div className="px-4 pt-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-background shadow-lg bg-card flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-primary">{initials}</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
              disabled={uploading}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <p className="text-xs text-muted-foreground mt-2">Tap to change photo</p>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="displayName" className="text-xs font-medium text-muted-foreground">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="How you want to appear"
              className="mt-1 rounded-xl"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Optional — shown instead of your full name</p>
          </div>

          <div>
            <Label htmlFor="bio" className="text-xs font-medium text-muted-foreground">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="mt-1 rounded-xl resize-none"
              rows={3}
              maxLength={300}
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{bio.length}/300</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">City</Label>
              <Input
                id="city"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Brooklyn"
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-xs font-medium text-muted-foreground">State</Label>
              <Input
                id="state"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="NY"
                className="mt-1 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
