/**
 * ProjectIcon
 * Rounded brand square with the project's initial.
 * Color is deterministic per project name, or explicit via `color`.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { colorFromString, mixWithBlack } from "@/lib/colors";

const SIZES = {
  sm: "size-6 rounded-md text-xs",
  md: "size-8 rounded-lg text-sm",
  lg: "size-11 rounded-xl text-lg",
} as const;

export function ProjectIcon({
  name,
  color,
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const base = color ?? colorFromString(name);
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-extrabold text-white",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: mixWithBlack(base, 0.1) }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
