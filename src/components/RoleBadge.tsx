import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RoleBadgeProps {
  role: "pro" | "client";
  className?: string;
  size?: "sm" | "md";
}

export function RoleBadge({ role, className, size = "sm" }: RoleBadgeProps) {
  const isPro = role === "pro";
  const dimensions = size === "sm" ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-center rounded-full font-bold shrink-0 ring-2 ring-background cursor-pointer transition-transform hover:scale-110",
            dimensions,
            isPro
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground",
            className
          )}
          aria-label={isPro ? "Professional account" : "Client account"}
        >
          {isPro ? "P" : "C"}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-auto max-w-[200px] p-2.5 rounded-xl text-xs text-center"
        sideOffset={4}
      >
        {isPro
          ? "✂️ Verified Professional — This user offers services on OpenChair"
          : "👤 Client — This user books services on OpenChair"}
      </PopoverContent>
    </Popover>
  );
}
