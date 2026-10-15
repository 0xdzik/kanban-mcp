/**
 * Kanban Column
 * Transparent lane on the dark canvas: status header with count,
 * droppable card list, and an inline "Add New" action.
 */

"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskCard from "./TaskCard";
import type { TaskWithLabels } from "@/types";
import { TASK_STATUS_CONFIG } from "@/types";

interface KanbanColumnProps {
  status: TaskWithLabels["status"];
  tasks: TaskWithLabels[];
  onAddTask: (status: TaskWithLabels["status"]) => void;
  onEditTask: (task: TaskWithLabels) => void;
}

export default function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = TASK_STATUS_CONFIG[status];

  return (
    <section className="flex w-[320px] flex-shrink-0 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {config.label}
          </h3>
          <span className="tabular-readout text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          aria-label={`Add task to ${config.label}`}
          className="flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "kanban-scroll flex-1 space-y-3 overflow-y-auto overflow-x-hidden rounded-xl border border-transparent pr-1 pb-4 transition-colors",
          isOver && "border-primary/30 bg-primary/5",
        )}
        style={{ minHeight: 80 }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-border/70 text-xs text-muted-foreground/70">
            No tasks yet
          </div>
        )}

        <button
          onClick={() => onAddTask(status)}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-4" />
          <span>Add New</span>
        </button>
      </div>
    </section>
  );
}
