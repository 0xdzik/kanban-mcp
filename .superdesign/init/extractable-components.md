# extractable-components.md — Extraction menu

Candidates for Superdesign `DraftComponent` entities. Extractable props are limited to state/navigation/visibility/count props that change per page; everything else (icons, copy, CSS) is hardcoded. Full source: `components.md` (primitives) / `layouts.md` (shell). Page composites (`KanbanBoard`, `DashboardView`, `TaskDialog`, `TaskDetailPanel`, `LabelManager`, `ProjectNotes`) are not extraction candidates — they are page-specific.

## Layout Components

### AppSidebar
- Source: `src/components/layout/AppSidebar.tsx`
- Category: layout
- Description: Dark left rail: brand, Dashboard nav, project list with counts, project create/rename/delete dialogs.
- Extractable props: activeItem (string, derived from usePathname(): "/" = Dashboard), projects (dynamic list + taskCount counts from useKanbanStore), showNewProject (boolean, default false)
- Hardcoded: brand text "Kanban MCP"/"Personal Workspace", "Dashboard"/"Projects" labels, FolderKanban/LayoutDashboard/Plus/MoreHorizontal/Pencil/Trash2 icons, w-64 rail CSS, all dialog copy

### PageHeader
- Source: `src/components/layout/PageHeader.tsx`
- Category: layout
- Description: Two-row header: breadcrumb bar with action slot, optional title row (dashboard + project pages).
- Extractable props: crumbs (nav: {label, href?}[]), icon, title, titleAdornment, meta, actions (visibility slots — omit title for bar-only), className
- Hardcoded: "/" breadcrumb separator, border-b bg-sidebar/40 px-6 py-3 / px-6 py-4 CSS, hover color transitions

### Breadcrumb
- Source: `src/components/layout/PageHeader.tsx`
- Category: layout
- Description: Crumb trail exported separately; last item bold, prior items linked.
- Extractable props: icon (slot), crumbs ({label, href?}[] navigation), className
- Hardcoded: "/" separator, link hover:text-foreground classes

### NavItem
- Source: `src/components/layout/AppSidebar.tsx`
- Category: layout
- Description: Internal sidebar nav row (not exported; local to AppSidebar).
- Extractable props: active (boolean, default false), badge (visibility/count slot), label, onClick (nav callback)
- Hardcoded: icon slot rendering, active bg-sidebar-accent / inactive hover CSS

## Basic Components

### Button
- Source: `src/components/ui/button.tsx`
- Category: basic
- Description: CVA action button in 6 variants and 8 sizes.
- Extractable props: variant (visual state: default|destructive|outline|secondary|ghost|link, default "default"), size (default|xs|sm|lg|icon|icon-xs|icon-sm|icon-lg), asChild (boolean, default false)
- Hardcoded: all CVA class strings, gap-2 rounded-md base CSS

### Badge
- Source: `src/components/ui/badge.tsx`
- Category: basic
- Description: Pill badge (outline badges in activity feed).
- Extractable props: variant (state: default|secondary|destructive|outline|ghost|link, default "default"), asChild (boolean)
- Hardcoded: rounded-full pill CSS, focus/aria classes

### CountBadge
- Source: `src/components/ui/count-badge.tsx`
- Category: basic
- Description: Numeric pill for task/project counts (sidebar, columns, header).
- Extractable props: variant (emphasis state: primary|muted|outline, default "primary"), children (dynamic count)
- Hardcoded: h-5 min-w-5 rounded-full pill, tabular-readout class

### Tag
- Source: `src/components/ui/tag.tsx`
- Category: basic
- Description: Pastel chip for priorities, statuses and labels (soft or outline).
- Extractable props: tone (default "slate"), variant (soft|outline, default "soft"), size (sm|md, default "md"), color (hex visibility override of tone), icon
- Hardcoded: pastel class pairs (TAG_TONES in src/lib/colors.ts), rounded-full base CSS

### ProjectIcon
- Source: `src/components/ui/project-icon.tsx`
- Category: basic
- Description: Rounded brand square showing the project initial.
- Extractable props: name (drives initial + deterministic color), color (hex override), size (sm|md|lg, default "md")
- Hardcoded: SIZES class map, font-extrabold white initial, aria-hidden

### AvatarStack
- Source: `src/components/ui/avatar-stack.tsx`
- Category: basic
- Description: Overlapping initial avatars with +N overflow counter (task cards).
- Extractable props: users ({name, color?}[] data), max (count cap, default 3), size (xs|sm, default "sm")
- Hardcoded: -space-x-1.5 overlap, ring-card, +N overflow pill styling

### Dialog
- Source: `src/components/ui/dialog.tsx`
- Category: basic
- Description: Modal used by sidebar project dialogs and task create/edit.
- Extractable props: open (visibility state), onOpenChange, DialogContent.showCloseButton (visibility, default true), DialogFooter.showCloseButton (default false)
- Hardcoded: overlay/backdrop CSS, close X icon and its classes

### Tabs
- Source: `src/components/ui/tabs.tsx`
- Category: basic
- Description: Tab set; project page uses TabsList variant="line" (Board/Notes).
- Extractable props: currentTab (value/defaultValue — active state), onValueChange, TabsList variant (default|line, default "default"), orientation
- Hardcoded: active indicator (after: pseudo-element), trigger active/disabled CSS; tab icons/labels live in pages

### Input
- Source: `src/components/ui/input.tsx`
- Category: basic
- Description: Single-line text field (search, dialog fields).
- Extractable props: placeholder, disabled (form state), value/onChange (form state), className
- Hardcoded: border-input ring/border CSS from ui/input.tsx

### Card
- Source: `src/components/ui/card.tsx`
- Category: basic
- Description: Dashboard stat/panel surface with header/content parts.
- Extractable props: none (className/native div props only; composed via CardHeader/CardTitle/CardAction/CardDescription/CardContent/CardFooter)
- Hardcoded: border rounded-xl shadow-xs card CSS

### ScrollArea
- Source: `src/components/ui/scroll-area.tsx`
- Category: basic
- Description: Themed scroll viewport (sidebar, dashboard activity, notes).
- Extractable props: orientation on ScrollBar (state: vertical|horizontal, default "vertical"), height via className
- Hardcoded: scrollbar thumb/track CSS

### TaskCard
- Source: `src/components/kanban/TaskCard.tsx`
- Category: basic
- Description: Draggable kanban card (data prop: task; callback onEdit) with tags, due date, avatar stack.
- Extractable props: isOverlay (visibility: static DragOverlay copy, default false)
- Hardcoded: Calendar/ListChecks/MessageSquare icons, id-ID date locale, all card CSS

### KanbanColumn
- Source: `src/components/kanban/KanbanColumn.tsx`
- Category: basic
- Description: Droppable status lane with header count and inline Add New.
- Extractable props: status (active lane identity), tasks (drives dynamic tasks.length count), onAddTask/onEditTask (nav callbacks)
- Hardcoded: status dot color/label from TASK_STATUS_CONFIG, Plus icon, w-80 lane CSS

### FilterBar
- Source: `src/components/kanban/FilterBar.tsx`
- Category: basic
- Description: Board toolbar: priority filter chips + search.
- Extractable props: activePriority (filter state, default null), onSearchChange/onPriorityFilter (state callbacks)
- Hardcoded: "Search tasks..." placeholder, Search/X icons, priority chip labels from TASK_PRIORITY_CONFIG

### DonutChart
- Source: `src/components/charts/DonutChart.tsx`
- Category: basic
- Description: SVG donut for status/priority distribution.
- Extractable props: data ({label, value, color}[] dynamic counts), size (default 140), strokeWidth (default 20)
- Hardcoded: SVG ring math, "No data" empty state

### MiniBarChart
- Source: `src/components/charts/MiniBarChart.tsx`
- Category: basic
- Description: SVG bar chart for the 14-day creation trend.
- Extractable props: data ({label, value}[] dynamic counts), height (default 120), color (default "#60a5fa")
- Hardcoded: SVG bar geometry, "No data" empty state
