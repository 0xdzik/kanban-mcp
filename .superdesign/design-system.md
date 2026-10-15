# Kanban MCP — Design System

Product context: personal project-management dashboard (`/` = overview dashboard, `/projects/:id` = kanban board with Board/Notes tabs) with MCP integration for agent-driven task tracking. Dark-first, machine-panel aesthetic: dense, tabular, high-contrast, no decorative flourishes.

## Brand & identity

- App name/title: `Kanban MCP — Project Dashboard`
- Logo position: sidebar top slot holds an inline SVG "three-column kanban" mark in a 9×9 rounded lime tile — that mark is the product logo; never replace it with initials, emoji, or a generic icon.
- Icons: `lucide-react` only (`FolderKanban`, `LayoutList`, `StickyNote`, `Plus`, `Check`, etc.), stroke-based, sized via `size-4`/`size-5`.
- No photography/illustration in-product. Charts are inline SVG.

## Fonts

| Role | Family | Variable | Weights |
| --- | --- | --- | --- |
| UI/sans | Plus Jakarta Sans | `--font-jakarta` | 400, 500, 600, 700, 800 |
| Mono / numerals | IBM Plex Mono | `--font-plex-mono` | 400, 500, 600 |

- `font-sans` = Plus Jakarta Sans (set on `<body>` in `src/app/layout.tsx`).
- Numeric readouts use `.tabular-readout` (`font-variant-numeric: tabular-nums`) so counts align in columns.
- Headings: `font-extrabold tracking-tight` for page titles; labels `text-xs`; meta `text-sm text-muted-foreground`.

## Color tokens

Shadcn CSS variables, oklch in light, hex in `.dark`. The app renders with `<html class="dark">` — **dark is the shipping theme**.

### Dark (`:root.dark`) — the product palette

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#0b0c0a` | app background |
| `--foreground` | `#f1f3ec` | primary text |
| `--card` | `#161815` | cards/panels |
| `--card-foreground` | `#f1f3ec` | card text |
| `--popover` | `#1b1d19` | menus/dialogs |
| `--popover-foreground` | `#f1f3ec` | menu text |
| `--primary` | `#c3f04d` | lime accent (buttons, focus, active) |
| `--primary-foreground` | `#17220a` | text on primary |
| `--secondary` | `#1f221c` | subtle fills, badges |
| `--secondary-foreground` | `#e8ebe0` | text on secondary |
| `--muted` | `#1e201b` | muted surfaces |
| `--muted-foreground` | `#8f9584` | secondary text |
| `--accent` | `#23261f` | hover fills |
| `--accent-foreground` | `#f1f3ec` | text on accent |
| `--destructive` | `#f0563c` | destructive actions |
| `--border` | `#272a23` | hairlines |
| `--input` | `#33372d` | input borders |
| `--ring` | `#c3f04d` | focus ring |
| `--sidebar` | `#0f110d` | sidebar surface |
| `--sidebar-foreground` | `#e8ebe0` | sidebar text |
| `--sidebar-primary` | `#c3f04d` | sidebar active |
| `--sidebar-accent` | `#1c1f18` | sidebar hover |
| `--sidebar-border` | `#23261f` | sidebar hairline |

Chart ramp (dark): `--chart-1` `#fbbf24`, `--chart-2` `#60a5fa`, `--chart-3` `#4ade80`, `--chart-4` `#a78bfa`, `--chart-5` `#94a3b8`.

### Light (`:root`)

| Token | Value |
| --- | --- |
| `--background` | `oklch(1 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` |
| `--primary` | `oklch(0.86 0.25 115)` |
| `--primary-foreground` | `oklch(0.2 0.05 115)` |
| `--ring` | `oklch(0.86 0.25 115)` |
| `--border` / `--input` | `oklch(0.922 0 0)` |
| `--muted` | `oklch(0.97 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` |
| `--destructive` | `oklch(0.637 0.237 25.331)` |
| `--sidebar` | `oklch(0.985 0 0)` |

Light chart ramp: `#d97706`-family `oklch(0.769 0.188 70.08)`, `oklch(0.6 0.118 184.704)`, `oklch(0.696 0.17 162.48)`, `oklch(0.627 0.265 303.9)`, `oklch(0.55 0.02 260)`.

### Non-token color sources

- `src/lib/colors.ts` — label palette, status colors, and per-project icon colors as fixed hex ramps; use it instead of inventing new hues for labels/statuses.
- Never hardcode a new hue in a component: map it to an existing token or an existing `colors.ts` ramp entry.

## Shape, spacing, elevation

- Radius scale derives from `--radius: 0.625rem` (10px): `radius-sm = -4px`, `radius-md = -2px`, `radius-lg = 10px`, `radius-xl = +4px` … `radius-4xl = +16px`. Panels/cards `rounded-lg`/`rounded-xl`; controls `rounded-md`/`rounded-sm`.
- Spacing: Tailwind v4 default 4px scale (`gap-2`, `p-4`, `px-6` on page gutters, `space-y-*`). Page chrome sits in `px-6` bands.
- Elevation: **no drop shadows on surfaces** — separation comes from 1px `border-border` hairlines plus surface stepping (`background` → `card` → `popover` → `accent`). Popover/dialog elevation comes from the shadcn dialog/sheet overlay only.
- App shell: fixed `h-screen overflow-hidden`, sidebar + `flex-1` main; only inner regions scroll.

## Layout structure

- `AppSidebar` (fixed left) → `main` → page: `PageHeader` (icon + breadcrumbs + title + actions) → content region.
- Kanban page: header, then `Tabs variant="line"` in a `border-b px-6` band, then tab content filling the remainder (`flex-1 overflow-hidden`).
- Board: horizontal column scroll; columns are cards with header (status color bar, title, count) + stacked task cards.

## Motion & interaction

- Transitions are short and functional only (`150ms`-class color/opacity/scale on hover, focus, drag lift).
- `@media (prefers-reduced-motion: reduce)` kills animation/transition duration globally — respect it.
- Drag-and-drop via `@dnd-kit`; drag state changes elevation/opacity, not color.
- Focus: `--ring` lime 2px outline via `border-border outline-ring/50` base layer.

## Component conventions (shadcn, style `new-york`, baseColor `neutral`)

- `class-variance-authority` variants, `cn()` merge from `src/lib/utils.ts`, `radix-ui` primitives, `lucide-react` icons.
- Buttons: primary = lime `bg-primary text-primary-foreground`, secondary = `bg-secondary`, ghost, outline, destructive; `rounded-md`.
- Badges/counts: `CountBadge` with `variant` (`muted` default), tabular numerals.
- Cards: `bg-card border border-border rounded-lg`.
- Dialogs/Sheets/Popovers: `bg-popover border border-border`, overlay `bg-black/50`-class dimmer.
- Typography scale: `text-xs` (12) labels · `text-sm` (14) body/meta · `text-base` (16) content · `text-xl font-extrabold tracking-tight` page titles · `text-2xl font-extrabold` stat numbers with `.tabular-readout`.

## Hard rules for generation

1. Use ONLY the fonts, colors, spacing, and component styles defined above. Do not introduce any fonts, colors, or visual styles not in this design system.
2. Dark theme is the shipped look; lime `#c3f04d` is the sole accent.
3. The sidebar kanban-tile logo mark must render wherever the source UI has a logo slot.
4. Icons must be reproduced 1:1 from the source components (`lucide-react`).
