import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useMyProProfile, useCreateService, useDeleteService } from "@/hooks/use-data";
import { ArrowLeft, Scissors, Plus, Trash2, Edit2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: string;
      service_name: string;
      price: number;
      duration_minutes: number;
      description?: string;
      instant_book?: boolean;
    }) => {
      const { id, ...rest } = args;
      const { error } = await supabase.from("services").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProProfile"] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}

interface ServiceForm {
  service_name: string;
  price: string;
  duration_minutes: string;
  description: string;
  instant_book: boolean;
}

const emptyForm: ServiceForm = { service_name: "", price: "", duration_minutes: "30", description: "", instant_book: false };

export default function ProServices() {
  const { data: proProfile, isLoading } = useMyProProfile();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const updateService = useUpdateService();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSheetOpen(true);
  };

  const openEdit = (service: any) => {
    setEditingId(service.id);
    setForm({
      service_name: service.service_name,
      price: String(Number(service.price)),
      duration_minutes: String(service.duration_minutes),
      description: service.description || "",
      instant_book: service.instant_book || false,
    });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!form.service_name.trim()) { toast.error("Service name is required"); return; }
    if (!form.price || Number(form.price) < 0) { toast.error("Enter a valid price"); return; }
    if (!proProfile) return;

    const payload = {
      service_name: form.service_name.trim(),
      price: Number(form.price),
      duration_minutes: Number(form.duration_minutes) || 30,
      description: form.description.trim() || undefined,
      instant_book: form.instant_book,
    };

    try {
      if (editingId) {
        await updateService.mutateAsync({ id: editingId, ...payload });
        toast.success("Service updated");
      } else {
        await createService.mutateAsync({ professional_profile_id: proProfile.id, ...payload });
        toast.success("Service added");
      }
      setSheetOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const isSaving = createService.isPending || updateService.isPending;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/pro/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            <h1 className="font-display font-bold text-lg">Services</h1>
          </div>
          <Button size="sm" className="rounded-full gap-1" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : !proProfile?.services?.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <Scissors className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display font-semibold text-sm">No services yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add your first service so clients can book.</p>
            <Button className="mt-4 rounded-full gap-1" onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </div>
        ) : (
          proProfile.services.map((service: any) => (
            <div key={service.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{service.service_name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{service.duration_minutes} min</p>
                  {service.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{service.description}</p>}
                  {service.instant_book && <span className="text-[10px] text-primary font-medium">⚡ Instant Book</span>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-display font-bold text-sm">${Number(service.price)}</p>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(service)} className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(service.id, service.service_name)} className="h-7 w-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display">{editingId ? "Edit Service" : "Add Service"}</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="text-xs">Service Name *</Label>
              <Input placeholder="e.g. Fade Haircut" value={form.service_name} onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))} className="mt-1 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Price ($) *</Label>
                <Input type="number" min="0" step="0.01" placeholder="35" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">Duration (min)</Label>
                <Input type="number" min="5" step="5" placeholder="30" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} className="mt-1 rounded-xl" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea placeholder="Describe the service..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1 rounded-xl" rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Instant Book</Label>
                <p className="text-xs text-muted-foreground">Clients can book without approval</p>
              </div>
              <Switch checked={form.instant_book} onCheckedChange={v => setForm(f => ({ ...f, instant_book: v }))} />
            </div>
            <Button className="w-full rounded-xl" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </div>
  );
}
