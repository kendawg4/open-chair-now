import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useCreatePost } from "@/hooks/use-data";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proProfileId: string;
}

export function CreatePostSheet({ open, onOpenChange, proProfileId }: CreatePostSheetProps) {
  const { user } = useAuth();
  const createPost = useCreatePost();
  const fileRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("update");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!content.trim()) { toast.error("Write something first"); return; }
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile && user) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/posts/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("portfolio").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
      await createPost.mutateAsync({
        professional_profile_id: proProfileId,
        content: content.trim(),
        image_url: imageUrl,
        post_type: postType,
      });
      toast.success("Post published!");
      setContent("");
      removeImage();
      setPostType("update");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Create Post</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 pt-4">
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="update">📝 Status Update</SelectItem>
              <SelectItem value="portfolio">📸 Portfolio</SelectItem>
              <SelectItem value="promotion">🔥 Promotion</SelectItem>
              <SelectItem value="opening">🪑 Opening</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="What's on your mind? Share an update, promo, or showcase your work..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-xl min-h-[120px] text-sm"
            maxLength={500}
          />
          <p className="text-[10px] text-muted-foreground text-right">{content.length}/500</p>

          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
              <button onClick={removeImage} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4 mr-1.5" /> Add Photo
            </Button>
          </div>

          <Button
            className="w-full rounded-full"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
          >
            {submitting ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Posting...</> : "Post"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
