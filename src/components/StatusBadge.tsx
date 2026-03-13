import { cn } from "@/lib/utils";
import { AvailabilityStatus } from "@/types";
import { statusLabels } from "@/data/mock";

const statusStyles: Record<AvailabilityStatus, string> = {
  "open-chair": "bg-status-open-chair text-primary-foreground status-glow-green",
  "available-now": "bg-status-available text-primary-foreground status-glow-green",
  "last-minute": "bg-status-last-minute text-accent-foreground status-glow-yellow",
  "appointment-only": "bg-status-appointment/20 text-accent-foreground border border-status-appointment/50",
  busy: "bg-status-busy text-primary-foreground",
  offline: "bg-status-offline/20 text-muted-foreground",
};

interface StatusBadgeProps {
  status: AvailabilityStatus;
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = "sm", pulse, className }: StatusBadgeProps) {
  const isAvailable = ["open-chair", "available-now", "last-minute"].includes(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        statusStyles[status],
        (pulse || isAvailable) && "animate-pulse-status",
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          isAvailable ? "bg-primary-foreground" : "bg-current opacity-50"
        )}
      />
      {statusLabels[status]}
    </span>
  );
}
