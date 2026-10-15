/**
 * Kanban Task Card
 * Dark surface card with tinted color chips, due date, and meta indicators.
 * Draggable via the whole card (click still opens details).
 */

"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, ListChecks, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { softColorStyle } from "@/lib/colors";
import { AvatarStack } from "@/components/ui/avatar-stack";
import type { TaskWithLabels } from "@/types";
import { TASK_PRIORITY_CONFIG } from "@/types";

interface TaskCardProps {
  task: TaskWithLabels;
  onEdit: (task: TaskWithLabels) => void;
  /** Rendered without drag handles/interactivity (e.g. in the DragOverlay) */
  isOverlay?: boolean;
}

/** Design chip: tinted pastel background from the real color, readable text. */
function Chip({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-medium leading-none"
      style={softColorStyle(color)}
    >
      {children}
    </span>
  );
}

function CardBody({ task }: { task: TaskWithLabels }) {
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
  const isDone = task.status === "done";

  return (
    <>
      <p
        className={cn(
          "mb-3 text-[13px] font-medium leading-snug text-foreground",
          isDone && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip color={priorityConfig.color}>{priorityConfig.label}</Chip>
        {task.labels.map((label) => (
          <Chip key={label.id} color={label.color}>
            {label.name}
          </Chip>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.dueDate && (
            <span className="tabular-readout flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(task.dueDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
          {task.subtaskCount > 0 && (
            <span className="tabular-readout flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              {task.subtaskDoneCount}/{task.subtaskCount}
            </span>
          )}
          {task.commentCount > 0 && (
            <span className="tabular-readout flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              {task.commentCount}
            </span>
          )}
        </div>
        {task.assignee && (
          <AvatarStack users={[{ name: task.assignee }]} max={1} size="xs" />
        )}
      </div>
    </>
  );
}

export default function TaskCard({ task, onEdit, isOverlay }: TaskCardProps) {
  const sortable = useSortable({ id: task.id, data: { task } });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    sortable;

  if (isOverlay) {
    return (
      <div className="flex flex-col rounded-xl border border-primary/40 bg-card p-4 shadow-xl shadow-black/40">
        <CardBody task={task} />
      </div>
    );
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors",
        "hover:border-gray-600",
        isDragging && "opacity-40",
        task.status === "done" && "opacity-75",
      )}
      onClick={() => onEdit(task)}
    >
      <div
        {...attributes}
        {...listeners}
        role="button"
        aria-label={`Open task: ${task.title}`}
        tabIndex={0}
        className="flex cursor-grab flex-col outline-none active:cursor-grabbing"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit(task);
          }
        }}
      >
        <CardBody task={task} />
      </div>
    </div>
  );
}
