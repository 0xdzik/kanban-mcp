/**
 * Shared color helpers
 * Pastel tag tones, hex utilities, and deterministic brand colors
 */

export type TagTone =
  | "rose"
  | "orange"
  | "amber"
  | "lime"
  | "emerald"
  | "sky"
  | "blue"
  | "violet"
  | "pink"
  | "slate";

/**
 * Soft = solid pastel chip (for dark cards), outline = tinted ghost chip.
 * Classes are static strings so Tailwind can detect them.
 */
export const TAG_TONES: Record<TagTone, { soft: string; outline: string }> = {
  rose: {
    soft: "bg-rose-300/90 text-rose-950",
    outline: "border-rose-400/40 text-rose-300",
  },
  orange: {
    soft: "bg-orange-300/90 text-orange-950",
    outline: "border-orange-400/40 text-orange-300",
  },
  amber: {
    soft: "bg-amber-200/90 text-amber-950",
    outline: "border-amber-400/40 text-amber-300",
  },
  lime: {
    soft: "bg-lime-300/90 text-lime-950",
    outline: "border-lime-400/40 text-lime-300",
  },
  emerald: {
    soft: "bg-emerald-300/90 text-emerald-950",
    outline: "border-emerald-400/40 text-emerald-300",
  },
  sky: {
    soft: "bg-sky-200/90 text-sky-950",
    outline: "border-sky-400/40 text-sky-300",
  },
  blue: {
    soft: "bg-blue-300/90 text-blue-950",
    outline: "border-blue-400/40 text-blue-300",
  },
  violet: {
    soft: "bg-violet-300/90 text-violet-950",
    outline: "border-violet-400/40 text-violet-300",
  },
  pink: {
    soft: "bg-pink-300/90 text-pink-950",
    outline: "border-pink-400/40 text-pink-300",
  },
  slate: {
    soft: "bg-slate-200/90 text-slate-900",
    outline: "border-slate-400/40 text-slate-300",
  },
};

const PROJECT_ICON_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

/** Deterministic color from a string (project name, user, etc.) */
export function colorFromString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return PROJECT_ICON_COLORS[hash % PROJECT_ICON_COLORS.length];
}

/** Mix a hex color toward white. amount 0..1 */
export function mixWithWhite(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  const r = Math.round(((num >> 16) & 0xff) * (1 - amount) + 255 * amount);
  const g = Math.round(((num >> 8) & 0xff) * (1 - amount) + 255 * amount);
  const b = Math.round((num & 0xff) * (1 - amount) + 255 * amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Mix a hex color toward black. amount 0..1 */
export function mixWithBlack(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  const r = Math.round(((num >> 16) & 0xff) * (1 - amount));
  const g = Math.round(((num >> 8) & 0xff) * (1 - amount));
  const b = Math.round((num & 0xff) * (1 - amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Pastel chip style for an arbitrary hex color (user labels from the DB).
 * Tints the background, keeps the text readable on top of dark cards.
 */
export function softColorStyle(hex: string): React.CSSProperties {
  return {
    backgroundColor: `${hex}33`,
    borderColor: `${hex}66`,
    color: mixWithWhite(hex, 0.55),
  };
}

/** Outline (ghost) chip style for an arbitrary hex color */
export function outlineColorStyle(hex: string): React.CSSProperties {
  return {
    backgroundColor: "transparent",
    borderColor: `${hex}55`,
    color: mixWithWhite(hex, 0.4),
  };
}
