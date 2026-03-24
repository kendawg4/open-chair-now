import { Switch } from "@/components/ui/switch";
import { useUpdateStatus } from "@/hooks/use-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OpenChairToggleProps {
  currentStatus: string;
  className?: string;
}

export function OpenChairToggle({ currentStatus, className }: OpenChairToggleProps) {
  const updateStatus = useUpdateStatus();
  const isOpen = currentStatus === "open-chair" || currentStatus === "available-now";

  const handleToggle = (checked: boolean) => {
    const newStatus = checked ? "open-chair" : "offline";
    updateStatus.mutate(
      { status: newStatus, note: checked ? "Open for walk-ins" : undefined },
      {
        onSuccess: () => {
          toast.success(checked ? "🪑 You're now Open Chair! Followers notified." : "Status set to offline");
        },
        onError: (e) => toast.error(e.message),
      }
    );
  };

  return (
    <div className={cn(
      "flex items-center justify-between rounded-2xl border-2 p-4 transition-all",
      isOpen
        ? "border-status-available bg-status-available/10"
        : "border-border bg-card",
      className
    )}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{isOpen ? "🪑" : "💤"}</span>
        <div>
          <p className="font-display font-bold text-base">
            {isOpen ? "Open Chair" : "Chair Closed"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isOpen ? "Clients can see you're available" : "Toggle to go live"}
          </p>
        </div>
      </div>
      <Switch
        checked={isOpen}
        onCheckedChange={handleToggle}
        disabled={updateStatus.isPending}
        className={cn(
          "scale-150 origin-right",
          isOpen
            ? "data-[state=checked]:bg-status-available"
            : "data-[state=unchecked]:bg-muted-foreground/30"
        )}
      />
    </div>
  );
}
