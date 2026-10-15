# theme.md — Design tokens & raw sources

## Part 1 — Compact token summary

**Stack**: Tailwind CSS **v4** — this repo has **no `tailwind.config.*` file** (verified). Theme is defined in `src/app/globals.css` via `@import "tailwindcss"` + `@theme inline`; PostCSS plugin `@tailwindcss/postcss` (`postcss.config.mjs`). shadcn: style `new-york`, baseColor `neutral`, `cssVariables: true`, icon library `lucide`. The app renders **dark-only** (`<html className="dark">` hardcoded in `src/app/layout.tsx`).

### Fonts & type scale
| Token | Value |
| --- | --- |
| `--font-sans` | `var(--font-jakarta)` — Plus Jakarta Sans (weights 400,500,600,700,800) via `next/font/google` in `src/app/layout.tsx` |
| `--font-mono` | `var(--font-plex-mono)` — IBM Plex Mono (weights 400,500,600) via `next/font/google` |

Type scale: **Tailwind v4 defaults** (`text-xs` 0.75rem … `text-4xl` 2.25rem etc.) — nothing overridden in this repo. Body: `bg-background text-foreground font-sans antialiased`.

### Color palette — `:root` (light)

| Token | Value |
| --- | --- |
| `--radius` | `0.625rem` |
| `--background` | `oklch(1 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` |
| `--card` | `oklch(1 0 0)` |
| `--card-foreground` | `oklch(0.145 0 0)` |
| `--popover` | `oklch(1 0 0)` |
| `--popover-foreground` | `oklch(0.145 0 0)` |
| `--primary` | `oklch(0.86 0.25 115)` |
| `--primary-foreground` | `oklch(0.2 0.05 115)` |
| `--secondary` | `oklch(0.97 0 0)` |
| `--secondary-foreground` | `oklch(0.205 0 0)` |
| `--muted` | `oklch(0.97 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` |
| `--accent` | `oklch(0.95 0 0)` |
| `--accent-foreground` | `oklch(0.205 0 0)` |
| `--destructive` | `oklch(0.637 0.237 25.331)` |
| `--border` | `oklch(0.922 0 0)` |
| `--input` | `oklch(0.922 0 0)` |
| `--ring` | `oklch(0.86 0.25 115)` |
| `--chart-1` | `oklch(0.769 0.188 70.08)` |
| `--chart-2` | `oklch(0.6 0.118 184.704)` |
| `--chart-3` | `oklch(0.696 0.17 162.48)` |
| `--chart-4` | `oklch(0.627 0.265 303.9)` |
| `--chart-5` | `oklch(0.55 0.02 260)` |
| `--sidebar` | `oklch(0.985 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--sidebar-primary` | `oklch(0.86 0.25 115)` |
| `--sidebar-primary-foreground` | `oklch(0.2 0.05 115)` |
| `--sidebar-accent` | `oklch(0.95 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` |
| `--sidebar-ring` | `oklch(0.86 0.25 115)` |

### Color palette — `.dark` (active)

| Token | Value |
| --- | --- |
| `--background` | `#0b0c0a` |
| `--foreground` | `#f1f3ec` |
| `--card` | `#161815` |
| `--card-foreground` | `#f1f3ec` |
| `--popover` | `#1b1d19` |
| `--popover-foreground` | `#f1f3ec` |
| `--primary` | `#c3f04d` |
| `--primary-foreground` | `#17220a` |
| `--secondary` | `#1f221c` |
| `--secondary-foreground` | `#e8ebe0` |
| `--muted` | `#1e201b` |
| `--muted-foreground` | `#8f9584` |
| `--accent` | `#23261f` |
| `--accent-foreground` | `#f1f3ec` |
| `--destructive` | `#f0563c` |
| `--border` | `#272a23` |
| `--input` | `#33372d` |
| `--ring` | `#c3f04d` |
| `--chart-1` | `#fbbf24` |
| `--chart-2` | `#60a5fa` |
| `--chart-3` | `#4ade80` |
| `--chart-4` | `#a78bfa` |
| `--chart-5` | `#94a3b8` |
| `--sidebar` | `#0f110d` |
| `--sidebar-foreground` | `#e8ebe0` |
| `--sidebar-primary` | `#c3f04d` |
| `--sidebar-primary-foreground` | `#17220a` |
| `--sidebar-accent` | `#1c1f18` |
| `--sidebar-accent-foreground` | `#f1f3ec` |
| `--sidebar-border` | `#23261f` |
| `--sidebar-ring` | `#c3f04d` |

Notes: `--primary` / `--ring` in dark = lime `#c3f04d` on near-black `--background: #0b0c0a`; `--chart-1..5` dark = `#fbbf24 / #60a5fa / #4ade80 / #a78bfa / #94a3b8`; sidebar dark = `#0f110d` with accent `#1c1f18`, border `#23261f`.

### Spacing, radii, shadows, breakpoints
- **Spacing**: Tailwind v4 default `--spacing` (0.25rem); not overridden.
- **Radius**: `--radius: 0.625rem` (10px); `@theme inline` derives `--radius-sm: calc(var(--radius) - 4px)`, `--radius-md: calc(var(--radius) - 2px)`, `--radius-lg: var(--radius)`, `--radius-xl: calc(var(--radius) + 4px)`, `--radius-2xl: +8px`, `--radius-3xl: +12px`, `--radius-4xl: +16px`.
- **Shadows**: Tailwind/shadcn defaults (`shadow-xs` on outline buttons/cards); not overridden.
- **Breakpoints**: Tailwind v4 defaults (sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem); not overridden. Used in markup e.g. `sm:grid-cols-2 lg:grid-cols-4`, `md:grid-cols-2`.

### Custom variants & utilities
- `@custom-variant dark (&:is(.dark *))` — dark mode tied to the `.dark` class.
- `@plugin "@tailwindcss/typography"` and `@import "tw-animate-css"`, `@import "shadcn/tailwind.css"`.
- `@utility tabular-readout` — `font-variant-numeric: tabular-nums` (count alignment).
- `prefers-reduced-motion` block forces animation/transition duration to ~0.
- Tag tone tokens (pastel chips): `rose, orange, amber, lime, emerald, sky, blue, violet, pink, slate` — soft/outline class pairs defined in `src/lib/colors.ts` (dump below).

## Part 2 — Raw sources

### `src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-jakarta);
  --font-mono: var(--font-plex-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.86 0.25 115);
  --primary-foreground: oklch(0.2 0.05 115);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.95 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.637 0.237 25.331);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.86 0.25 115);
  --chart-1: oklch(0.769 0.188 70.08);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.696 0.17 162.48);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.55 0.02 260);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.86 0.25 115);
  --sidebar-primary-foreground: oklch(0.2 0.05 115);
  --sidebar-accent: oklch(0.95 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.86 0.25 115);
}

.dark {
  --background: #0b0c0a;
  --foreground: #f1f3ec;
  --card: #161815;
  --card-foreground: #f1f3ec;
  --popover: #1b1d19;
  --popover-foreground: #f1f3ec;
  --primary: #c3f04d;
  --primary-foreground: #17220a;
  --secondary: #1f221c;
  --secondary-foreground: #e8ebe0;
  --muted: #1e201b;
  --muted-foreground: #8f9584;
  --accent: #23261f;
  --accent-foreground: #f1f3ec;
  --destructive: #f0563c;
  --border: #272a23;
  --input: #33372d;
  --ring: #c3f04d;
  --chart-1: #fbbf24;
  --chart-2: #60a5fa;
  --chart-3: #4ade80;
  --chart-4: #a78bfa;
  --chart-5: #94a3b8;
  --sidebar: #0f110d;
  --sidebar-foreground: #e8ebe0;
  --sidebar-primary: #c3f04d;
  --sidebar-primary-foreground: #17220a;
  --sidebar-accent: #1c1f18;
  --sidebar-accent-foreground: #f1f3ec;
  --sidebar-border: #23261f;
  --sidebar-ring: #c3f04d;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Machine-panel numerals: counts line up in columns */
@utility tabular-readout {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### `src/lib/colors.ts`

```ts
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
```

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### `postcss.config.mjs`

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### Tailwind config

None — Tailwind v4 (`tailwindcss@^4`, `@tailwindcss/postcss@^4` in `package.json`); no `tailwind.config.ts/js` exists in the repo. All theme values come from `@theme inline` + `:root` / `.dark` in `src/app/globals.css` above.
