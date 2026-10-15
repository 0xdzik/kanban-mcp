/**
 * CountBadge
 * Small numeric pill for task/project counts — lime for emphasis,
 * muted for neutral counts.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export function CountBadge({
  className,
  variant = "primary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "primary" | "muted" | "outline";
}) {
  return (
    <span
      className={cn(
        "tabular-readout inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
        variant === "primary" &&
          "bg-primary text-primary-foreground group-hover:bg-primary/90",
        variant === "muted" && "bg-muted text-muted-foreground",
        variant === "outline" && "border border-border text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
