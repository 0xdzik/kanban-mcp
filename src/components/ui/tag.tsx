/**
 * Tag
 * Rounded pastel chip for priorities, statuses, and free-form labels.
 * Tones render as solid pastel (soft) or tinted ghost (outline);
 * arbitrary hex colors are supported via the `color` prop.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  TAG_TONES,
  outlineColorStyle,
  softColorStyle,
  type TagTone,
} from "@/lib/colors";

type TagVariant = "soft" | "outline";
type TagSize = "sm" | "md";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  variant?: TagVariant;
  size?: TagSize;
  /** Raw hex color (e.g. from a user-created label). Overrides `tone`. */
  color?: string;
  icon?: React.ReactNode;
}

const BASE_CLASSES =
  "inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-full border font-semibold leading-5 select-none [&>svg]:shrink-0";

const SIZES: Record<TagSize, string> = {
  sm: "px-2 py-px text-[11px] [&>svg]:size-2.5",
  md: "px-2.5 py-0.5 text-xs [&>svg]:size-3",
};

export function Tag({
  className,
  tone = "slate",
  variant = "soft",
  size = "md",
  color,
  icon,
  style,
  children,
  ...props
}: TagProps) {
  const toneClasses = color
    ? ""
    : `${TAG_TONES[tone].soft} border-transparent ${
        variant === "outline" ? TAG_TONES[tone].outline : ""
      }`;

  const toneStyle = color
    ? variant === "soft"
      ? softColorStyle(color)
      : outlineColorStyle(color)
    : undefined;

  return (
    <span
      className={cn(
        BASE_CLASSES,
        SIZES[size],
        variant === "outline" && !color && "bg-transparent",
        toneClasses,
        className,
      )}
      style={{ ...toneStyle, ...style }}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
