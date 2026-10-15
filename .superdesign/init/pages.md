# pages.md — Page dependency trees

Local imports traced recursively from each page entry (alias `@/*` = `src/*`). Excluded: `node_modules`, `.next`, CSS, and API route handlers (server-side, not part of the page tree). Both pages render inside the root shell `src/app/layout.tsx` → `src/components/layout/AppSidebar.tsx` + `<main>`.

Leaf notes: `src/lib/utils.ts` → deps `clsx`, `tailwind-merge` (node_modules); `src/lib/db/schema.ts` → deps `drizzle-orm` (node_modules); `src/lib/colors.ts`, `src/components/charts/DonutChart.tsx`, `src/components/charts/MiniBarChart.tsx` have no further local imports.

## / (Dashboard Page)
Entry: src/app/page.tsx

Dependencies:
- src/components/dashboard/DashboardView.tsx
  - src/components/ui/card.tsx
    - src/lib/utils.ts
  - src/components/ui/badge.tsx
    - src/lib/utils.ts
  - src/components/ui/button.tsx
    - src/lib/utils.ts
  - src/components/ui/scroll-area.tsx
    - src/lib/utils.ts
  - src/hooks/useKanbanStore.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
  - src/components/layout/PageHeader.tsx
    - src/lib/utils.ts
  - src/components/charts/DonutChart.tsx
  - src/components/charts/MiniBarChart.tsx
  - src/types/index.ts
    - src/lib/db/schema.ts
    - src/lib/colors.ts

Renders: `DashboardView` — PageHeader (Dashboard crumb + Export CSV button), 4 stat cards (Total Projects / Total Tasks / In Progress / Completed), Status Distribution + Priority Distribution donuts, "Tasks Created (14 days)" bar chart, Project Breakdown, Recent Activity feed (ScrollArea). Data from `/api/dashboard` + `/api/analytics` via `useKanbanStore.fetchDashboard` and a direct fetch.

## /projects/:id (Kanban Board Page)
Entry: src/app/projects/[id]/page.tsx

Dependencies:
- src/components/kanban/KanbanBoard.tsx
  - src/components/kanban/KanbanColumn.tsx
    - src/lib/utils.ts
    - src/components/ui/count-badge.tsx
      - src/lib/utils.ts
    - src/components/kanban/TaskCard.tsx
      - src/lib/utils.ts
      - src/components/ui/tag.tsx
        - src/lib/utils.ts
        - src/lib/colors.ts
      - src/components/ui/avatar-stack.tsx
        - src/lib/utils.ts
        - src/lib/colors.ts
      - src/types/index.ts
        - src/lib/db/schema.ts
        - src/lib/colors.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
  - src/components/kanban/TaskCard.tsx
    - src/lib/utils.ts
    - src/components/ui/tag.tsx
      - src/lib/utils.ts
      - src/lib/colors.ts
    - src/components/ui/avatar-stack.tsx
      - src/lib/utils.ts
      - src/lib/colors.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
  - src/components/kanban/TaskDialog.tsx
    - src/components/ui/dialog.tsx
      - src/lib/utils.ts
      - src/components/ui/button.tsx
        - src/lib/utils.ts
    - src/components/ui/button.tsx
      - src/lib/utils.ts
    - src/components/ui/input.tsx
      - src/lib/utils.ts
    - src/components/ui/textarea.tsx
      - src/lib/utils.ts
    - src/components/ui/tag.tsx
      - src/lib/utils.ts
      - src/lib/colors.ts
    - src/lib/colors.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
  - src/components/kanban/TaskDetailPanel.tsx
    - src/components/ui/sheet.tsx
      - src/lib/utils.ts
    - src/components/ui/tabs.tsx
      - src/lib/utils.ts
    - src/components/ui/button.tsx
      - src/lib/utils.ts
    - src/components/ui/input.tsx
      - src/lib/utils.ts
    - src/components/ui/textarea.tsx
      - src/lib/utils.ts
    - src/components/ui/scroll-area.tsx
      - src/lib/utils.ts
    - src/components/ui/separator.tsx
      - src/lib/utils.ts
    - src/components/ui/tag.tsx
      - src/lib/utils.ts
      - src/lib/colors.ts
    - src/lib/colors.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
  - src/components/kanban/FilterBar.tsx
    - src/components/ui/input.tsx
      - src/lib/utils.ts
    - src/components/ui/tag.tsx
      - src/lib/utils.ts
      - src/lib/colors.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
    - src/lib/colors.ts
  - src/hooks/useKanbanStore.ts
    - src/types/index.ts
      - src/lib/db/schema.ts
      - src/lib/colors.ts
  - src/types/index.ts
    - src/lib/db/schema.ts
    - src/lib/colors.ts
- src/components/kanban/LabelManager.tsx
  - src/components/ui/button.tsx
    - src/lib/utils.ts
  - src/components/ui/input.tsx
    - src/lib/utils.ts
  - src/components/ui/tag.tsx
    - src/lib/utils.ts
    - src/lib/colors.ts
  - src/components/ui/popover.tsx
    - src/lib/utils.ts
- src/components/kanban/ProjectNotes.tsx
  - src/components/ui/button.tsx
    - src/lib/utils.ts
  - src/components/ui/input.tsx
    - src/lib/utils.ts
  - src/components/ui/textarea.tsx
    - src/lib/utils.ts
  - src/components/ui/scroll-area.tsx
    - src/lib/utils.ts
  - src/components/ui/separator.tsx
    - src/lib/utils.ts
- src/components/layout/PageHeader.tsx
  - src/lib/utils.ts
- src/components/ui/project-icon.tsx
  - src/lib/utils.ts
  - src/lib/colors.ts
- src/components/ui/count-badge.tsx
  - src/lib/utils.ts
- src/components/ui/tabs.tsx
  - src/lib/utils.ts
- src/hooks/useKanbanStore.ts
  - src/types/index.ts
    - src/lib/db/schema.ts
    - src/lib/colors.ts

Renders: `PageHeader` (Project breadcrumb, `ProjectIcon` + title/description, task `CountBadge`, `LabelManager` popover) then line-variant `Tabs`: Board → `KanbanBoard` (FilterBar, 4 `KanbanColumn`s, `TaskCard`s, `TaskDialog`, `TaskDetailPanel` sheet) / Notes → `ProjectNotes` (create/edit/delete project notes). State via `useKanbanStore`.
