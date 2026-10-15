# routes.md — Route map

Next.js 16 App Router (file-based routing; no router config file). Pages under `src/app`, API route handlers under `src/app/api/**`. Both pages render inside the root layout shell (`src/app/layout.tsx` → `AppSidebar` + `<main>`).

## Page routes

| URL | Page file | Layout | Renders |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | root shell (`src/app/layout.tsx`) | `DashboardView`: PageHeader (Dashboard crumb + Export CSV action), 4 summary stat cards (Total Projects, Total Tasks, In Progress, Completed), Status/Priority `DonutChart` cards, 14-day trend `MiniBarChart`, Project Breakdown, Recent Activity feed |
| `/projects/:id` | `src/app/projects/[id]/page.tsx` | root shell + `PageHeader` | Breadcrumb + project title row (`ProjectIcon`, task `CountBadge`, `LabelManager` action), line-variant Tabs → Board (`KanbanBoard`) / Notes (`ProjectNotes`) |

A separate MCP stdio server lives at `src/mcp-server/index.ts` (npm script `mcp:start`) — not an HTTP route.

## Page sources (full)

### `/` — `src/app/page.tsx`

```tsx
/**
 * Dashboard Page (Home)
 * Shows the main dashboard overview with stats and activity
 */

import DashboardView from "@/components/dashboard/DashboardView";

export default function HomePage() {
  return <DashboardView />;
}
```

### `/projects/:id` — `src/app/projects/[id]/page.tsx`

```tsx
/**
 * Kanban Board Page
 * Page header with breadcrumb + project title, then Board/Notes tabs.
 */

"use client";

import { useEffect, use } from "react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import LabelManager from "@/components/kanban/LabelManager";
import ProjectNotes from "@/components/kanban/ProjectNotes";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectIcon } from "@/components/ui/project-icon";
import { CountBadge } from "@/components/ui/count-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FolderKanban, LayoutList, StickyNote } from "lucide-react";
import { useKanbanStore } from "@/hooks/useKanbanStore";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const { setActiveProject, projects, fetchProjects } = useKanbanStore();

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  useEffect(() => {
    if (id) {
      setActiveProject(id);
    }
  }, [id, setActiveProject]);

  const project = projects.find((p) => p.id === id);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader
        icon={
          <FolderKanban className="size-4 text-muted-foreground" aria-hidden />
        }
        crumbs={[{ label: "Project", href: "/" }, { label: project?.name ?? "..." }]}
        actions={<LabelManager projectId={id} />}
        title={
          <>
            <ProjectIcon name={project?.name ?? "?"} size="lg" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold tracking-tight">
                {project?.name || "Loading..."}
              </h1>
              {project?.description && (
                <p className="truncate text-xs text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
          </>
        }
        titleAdornment={
          project && (
            <CountBadge variant="muted" className="ml-1">
              {project.taskCount} tasks
            </CountBadge>
          )
        }
      />

      <Tabs
        defaultValue="board"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="border-b border-border px-6">
          <TabsList variant="line">
            <TabsTrigger value="board">
              <LayoutList className="size-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="notes">
              <StickyNote className="size-4" />
              Notes
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="board" className="flex flex-1 overflow-hidden mt-0">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="notes" className="flex flex-1 overflow-hidden mt-0">
          <ProjectNotes projectId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## API routes (`src/app/api/**`)

| Path | Methods | Handler file |
| --- | --- | --- |
| `/api/tasks` | `GET` · `POST` | `src/app/api/tasks/route.ts` |
| `/api/tasks/[id]` | `GET` · `PATCH` · `DELETE` | `src/app/api/tasks/[id]/route.ts` |
| `/api/tasks/reorder` | `POST` | `src/app/api/tasks/reorder/route.ts` |
| `/api/projects` | `GET` · `POST` | `src/app/api/projects/route.ts` |
| `/api/projects/[id]` | `GET` · `PATCH` · `DELETE` | `src/app/api/projects/[id]/route.ts` |
| `/api/notes` | `GET` · `POST` | `src/app/api/notes/route.ts` |
| `/api/notes/[id]` | `GET` · `PATCH` · `DELETE` | `src/app/api/notes/[id]/route.ts` |
| `/api/labels` | `GET` · `POST` | `src/app/api/labels/route.ts` |
| `/api/labels/[id]` | `PATCH` · `DELETE` | `src/app/api/labels/[id]/route.ts` |
| `/api/task-labels` | `POST` · `DELETE` | `src/app/api/task-labels/route.ts` |
| `/api/comments` | `GET` · `POST` | `src/app/api/comments/route.ts` |
| `/api/comments/[id]` | `DELETE` | `src/app/api/comments/[id]/route.ts` |
| `/api/activity` | `GET` | `src/app/api/activity/route.ts` |
| `/api/dashboard` | `GET` | `src/app/api/dashboard/route.ts` |
| `/api/analytics` | `GET` | `src/app/api/analytics/route.ts` |
| `/api/export` | `GET` | `src/app/api/export/route.ts` |
