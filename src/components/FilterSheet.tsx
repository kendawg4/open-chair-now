import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

const statusFilters = [
  { value: "open-chair", label: "Open Chair" },
  { value: "available-now", label: "Available Now" },
  { value: "last-minute", label: "Last-Minute" },
  { value: "appointment-only", label: "Appointment Only" },
];

const categoryFilters = [
  { value: "barber", label: "Barber" },
  { value: "hairstylist", label: "Hairstylist" },
  { value: "braider", label: "Braider" },
  { value: "loc-specialist", label: "Loc Specialist" },
  { value: "nail-tech", label: "Nail Tech" },
  { value: "esthetician", label: "Esthetician" },
  { value: "lash-tech", label: "Lash Tech" },
  { value: "makeup-artist", label: "Makeup Artist" },
  { value: "tattoo-artist", label: "Tattoo Artist" },
  { value: "piercer", label: "Piercer" },
];

interface FilterSheetProps {
  onApply: (filters: { statuses: string[]; categories: string[]; walkIns: boolean | null; distanceMiles: number | null }) => void;
}

export function FilterSheet({ onApply }: FilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [walkIns, setWalkIns] = useState<boolean | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);

  const distanceOptions = [
    { value: 1, label: "Within 1 mile" },
    { value: 3, label: "Within 3 miles" },
    { value: 5, label: "Within 5 miles" },
    { value: 10, label: "Within 10 miles" },
    { value: null, label: "Any distance" },
  ];

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleApply = () => {
    onApply({ statuses, categories, walkIns, distanceMiles });
    setOpen(false);
  };

  const handleClear = () => {
    setStatuses([]);
    setCategories([]);
    setWalkIns(null);
    setDistanceMiles(null);
    onApply({ statuses: [], categories: [], walkIns: null, distanceMiles: null });
    setOpen(false);
  };

  const activeCount = statuses.length + categories.length + (walkIns !== null ? 1 : 0) + (distanceMiles !== null ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Filters</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Availability</p>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => toggle(statuses, f.value, setStatuses)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                    statuses.includes(f.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => toggle(categories, f.value, setCategories)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                    categories.includes(f.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Walk-ins</p>
            <div className="flex gap-2">
              {[
                { val: true, label: "Walk-ins welcome" },
                { val: false, label: "Appointment only" },
              ].map(opt => (
                <button
                  key={String(opt.val)}
                  onClick={() => setWalkIns(walkIns === opt.val ? null : opt.val)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                    walkIns === opt.val
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Distance</p>
            <div className="flex flex-wrap gap-2">
              {distanceOptions.map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setDistanceMiles(opt.value)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                    distanceMiles === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={handleClear}>Clear all</Button>
            <Button className="flex-1 rounded-xl" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
