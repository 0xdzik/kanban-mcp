/**
 * AvatarStack
 * Overlapping initial avatars with deterministic brand colors,
 * plus an overflow counter. Used on task cards and board headers.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { colorFromString, mixWithBlack } from "@/lib/colors";

export interface StackUser {
  name: string;
  color?: string;
}

export function AvatarStack({
  users,
  max = 3,
  size = "sm",
  className,
}: {
  users: StackUser[];
  max?: number;
  size?: "xs" | "sm";
  className?: string;
}) {
  if (users.length === 0) return null;

  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;
  const dimension = size === "xs" ? "size-5 text-[9px]" : "size-6 text-[10px]";

  return (
    <div className={cn("flex -space-x-1.5", className)}>
      {visible.map((user) => {
        const base = user.color ?? colorFromString(user.name);
        return (
          <span
            key={user.name}
            title={user.name}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-card",
              dimension,
            )}
            style={{ backgroundColor: mixWithBlack(base, 0.15) }}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
        );
      })}
      {overflow > 0 && (
        <span
          className={cn(
            "tabular-readout inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground ring-2 ring-card",
            dimension,
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
