import { useState, useRef } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useMyProProfile, useUploadPortfolioItem, useDeletePortfolioItem } from "@/hooks/use-data";
import { ArrowLeft, Image, Plus, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

export default function ProPortfolio() {
  const { data: proProfile, isLoading } = useMyProProfile();
  const uploadItem = useUploadPortfolioItem();
  const deleteItem = useDeletePortfolioItem();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); return; }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setUploadOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !proProfile) return;
    try {
      await uploadItem.mutateAsync({ file: selectedFile, proProfileId: proProfile.id, caption: caption.trim() || undefined });
      toast.success("Image uploaded!");
      setUploadOpen(false);
      setSelectedFile(null);
      setPreview(null);
      setCaption("");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Image deleted");
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            <h1 className="font-display font-bold text-lg">Portfolio</h1>
          </div>
          <Button size="sm" className="rounded-full gap-1" onClick={() => fileRef.current?.click()}>
            <Plus className="h-4 w-4" /> Upload
          </Button>
        </div>
      </header>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="px-4 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}</div>
        ) : !proProfile?.portfolio_items?.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <Image className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display font-semibold text-sm">No portfolio images yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Upload your best work to attract clients.</p>
            <Button className="mt-4 rounded-full gap-1" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {proProfile.portfolio_items.map((item: any) => (
              <div key={item.id} className="relative overflow-hidden rounded-2xl border border-border bg-card group">
                <img src={item.media_url} alt={item.caption || "Portfolio item"} className="aspect-square w-full object-cover" />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
                {item.caption && <p className="p-3 text-xs text-muted-foreground">{item.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <Sheet open={uploadOpen} onOpenChange={setUploadOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="font-display">Upload Image</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            {preview && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
              </div>
            )}
            <div>
              <Input placeholder="Add a caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} className="rounded-xl" />
            </div>
            <Button className="w-full rounded-xl" onClick={handleUpload} disabled={uploadItem.isPending}>
              {uploadItem.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav role="pro" />
    </div>
  );
}
