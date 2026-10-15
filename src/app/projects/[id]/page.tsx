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
              <h1 className="truncate">
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
            <CountBadge variant="muted">
              {project.taskCount} tasks
            </CountBadge>
          )
        }
      />

      <Tabs
        defaultValue="board"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="mt-6 border-b border-[#222] px-8">
          <TabsList
            variant="line"
            className="h-auto! gap-6 rounded-none bg-transparent p-0"
          >
            <TabsTrigger
              value="board"
              className="flex-none h-auto gap-2 rounded-none border-0 px-0 pb-4 after:opacity-0! data-[state=active]:border-b-2 data-[state=active]:border-primary! data-[state=active]:text-primary!"
            >
              <LayoutList className="size-4" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-none h-auto gap-2 rounded-none border-0 px-0 pb-4 after:opacity-0! data-[state=active]:border-b-2 data-[state=active]:border-primary! data-[state=active]:text-primary!"
            >
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
