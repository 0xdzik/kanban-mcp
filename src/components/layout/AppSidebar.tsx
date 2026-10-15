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
          ? "bg-sidebar-accent text-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
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
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-3 p-6">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FolderKanban className="size-4" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">
            Kanban MCP
          </span>
          <span className="text-xs text-muted-foreground">
            Personal Workspace
          </span>
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden px-4 pb-6">
        <div className="space-y-1">
          <NavItem
            icon={<LayoutDashboard className="size-4" />}
            label="Dashboard"
            active={pathname === "/"}
            onClick={() => router.push("/")}
          />
        </div>

        {/* Projects */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-2 flex items-center justify-between px-3 pr-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Projects
            </p>
            <div className="flex items-center gap-1">
              <CountBadge className="size-5 px-0 text-[10px]">
                {projects.length}
              </CountBadge>
              <button
                onClick={() => setShowNewProject(true)}
                aria-label="New project"
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-1">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                    activeProjectId === project.id
                      ? "bg-sidebar-accent"
                      : "hover:bg-sidebar-accent",
                  )}
                >
                  <button
                    onClick={() => openProject(project.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <ProjectIcon name={project.name} size="sm" />
                    <span
                      className={cn(
                        "truncate text-sm font-medium transition-colors",
                        activeProjectId === project.id
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {project.name}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center">
                    <CountBadge
                      variant="muted"
                      className="size-5 px-0 text-[10px] transition-opacity group-hover:opacity-0 group-focus-within:opacity-0 group-has-[data-state=open]:opacity-0"
                    >
                      {project.taskCount}
                    </CountBadge>
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
                  <span className="font-semibold text-foreground">+</span> to
                  create one.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </nav>

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
