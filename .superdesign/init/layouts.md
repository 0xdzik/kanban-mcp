# layouts.md — Cross-page layout

App shell: `src/app/layout.tsx` renders `<html lang="en" className="dark">` → `<div className="flex h-screen overflow-hidden">` → `AppSidebar` + `<main>`; every route renders inside `<main>`. `src/components/layout/` contains exactly two files: `AppSidebar.tsx` and `PageHeader.tsx` (no other cross-page wrappers exist).

## src/app/layout.tsx
Root layout for all routes: loads Plus Jakarta Sans (`--font-jakarta`) and IBM Plex Mono (`--font-plex-mono`) via `next/font`, imports `globals.css`, mounts the shell (`AppSidebar` + `main`).

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/layout/AppSidebar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kanban MCP - Project Dashboard",
  description:
    "Personal project management dashboard with MCP integration for tracking progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jakarta.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

## src/components/layout/AppSidebar.tsx
Dark left rail (client component): brand block, Dashboard nav item, Projects header with count + create button, scrollable project list with `ProjectIcon`s/task counts and a rename/delete dropdown, plus New/Rename/Delete project dialogs. Reads `useKanbanStore`, navigates with `next/navigation`.

```tsx
/**
 * App Sidebar
 * Dark rail: brand, dashboard nav, project list with icons/counts,
 * and project create/rename/delete dialogs.
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CountBadge } from "@/components/ui/count-badge";
import { ProjectIcon } from "@/components/ui/project-icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useKanbanStore } from "@/hooks/useKanbanStore";

interface ProjectRef {
  id: string;
  name: string;
}

function NavItem({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge}
    </button>
  );
}

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    projects,
    activeProjectId,
    fetchProjects,
    setActiveProject,
    createProject,
    updateProject,
    deleteProject,
  } = useKanbanStore();

  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProject, setEditingProject] = useState<ProjectRef | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingProject, setDeletingProject] = useState<ProjectRef | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    const project = await createProject({ name: newProjectName.trim() });
    setNewProjectName("");
    setShowNewProject(false);
    setActiveProject(project.id);
    router.push(`/projects/${project.id}`);
  };

  const handleRenameProject = async () => {
    if (!editingProject || !editName.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await updateProject(editingProject.id, { name: editName.trim() });
      setEditingProject(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject || isSaving) return;
    setIsSaving(true);
    const wasActive = activeProjectId === deletingProject.id;
    try {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);
      if (wasActive) router.push("/");
    } finally {
      setIsSaving(false);
    }
  };

  const openProject = (id: string) => {
    setActiveProject(id);
    router.push(`/projects/${id}`);
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FolderKanban className="size-4.5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-extrabold tracking-tight">Kanban MCP</p>
          <p className="text-[11px] text-muted-foreground">
            Personal Workspace
          </p>
        </div>
      </div>

      <nav className="px-3">
        <NavItem
          icon={<LayoutDashboard className="size-4" />}
          label="Dashboard"
          active={pathname === "/"}
          onClick={() => router.push("/")}
        />
      </nav>

      <div className="mt-4 border-t border-sidebar-border" />

      {/* Projects */}
      <div className="flex items-center justify-between px-3 pr-2.5 pt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
          Projects
        </p>
        <div className="flex items-center gap-1">
          <CountBadge>{projects.length}</CountBadge>
          <button
            onClick={() => setShowNewProject(true)}
            aria-label="New project"
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-0.5">
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg py-1.5 pl-2 pr-1 transition-colors",
                activeProjectId === project.id && "bg-sidebar-accent",
              )}
            >
              <button
                onClick={() => openProject(project.id)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
              >
                <ProjectIcon name={project.name} size="sm" />
                <span
                  className={cn(
                    "truncate text-sm font-medium transition-colors",
                    activeProjectId === project.id
                      ? "text-primary"
                      : "text-sidebar-foreground/80 group-hover:text-sidebar-accent-foreground",
                  )}
                >
                  {project.name}
                </span>
              </button>
              <div className="flex shrink-0 items-center">
                <span className="tabular-readout text-xs text-muted-foreground transition-opacity group-hover:opacity-0 group-focus-within:opacity-0 group-has-[data-state=open]:opacity-0">
                  {project.taskCount}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label={`Actions for ${project.name}`}
                      className="pointer-events-none flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent-foreground/10 hover:text-foreground group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-has-[data-state=open]:pointer-events-auto group-has-[data-state=open]:opacity-100"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingProject(project);
                        setEditName(project.name);
                      }}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeletingProject(project)}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No projects yet. Press{" "}
              <span className="font-semibold text-foreground">+</span> to create
              one.
            </p>
          )}
        </div>
      </ScrollArea>

      {/* New project dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="project-name"
              placeholder="My awesome project"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateProject();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename project dialog */}
      <Dialog
        open={editingProject !== null}
        onOpenChange={(open) => {
          if (!open) setEditingProject(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label htmlFor="edit-project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="edit-project-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameProject();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProject(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameProject}
              disabled={!editName.trim() || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete project confirmation */}
      <Dialog
        open={deletingProject !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingProject(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="py-2 text-sm text-muted-foreground">
            Are you sure you want to{" "}
            <span className="font-medium text-foreground">
              {deletingProject?.name}
            </span>
            ? All of its tasks and notes will also be deleted. This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingProject(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={isSaving}
            >
              {isSaving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
```

## src/components/layout/PageHeader.tsx
Two-row page header: breadcrumb bar with optional action slot, then an optional title row (icon/title/adornment/meta). Exports `Breadcrumb`, `PageHeader`, and the `Crumb` type. Used by both `DashboardView` and the project page.

```tsx
/**
 * PageHeader
 * Two-row page header: breadcrumb bar with actions, then a title row.
 * Reused by the dashboard and project pages.
 */

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  icon,
  crumbs,
  className,
}: {
  icon?: React.ReactNode;
  crumbs: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      {icon}
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted-foreground/40">/</span>}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHeader({
  icon,
  crumbs,
  actions,
  title,
  titleAdornment,
  meta,
  className,
}: {
  icon?: React.ReactNode;
  crumbs: Crumb[];
  actions?: React.ReactNode;
  /** Big title row. Omit to render only the breadcrumb bar. */
  title?: React.ReactNode;
  titleAdornment?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "shrink-0 border-b border-border bg-sidebar/40",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <Breadcrumb icon={icon} crumbs={crumbs} />
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {title && (
        <div className="flex items-center justify-between gap-4 border-t border-border/60 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {title}
            {titleAdornment}
          </div>
          {meta && <div className="flex items-center gap-2">{meta}</div>}
        </div>
      )}
    </header>
  );
}
```
