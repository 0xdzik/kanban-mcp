/**
 * Shared type definitions for Kanban MCP
 * 1. Task and Project types re-exported from schema
 * 2. API request/response types
 * 3. Kanban board types
 */

export type {
  Project,
  NewProject,
  Task,
  NewTask,
  Label,
  NewLabel,
  Comment,
  NewComment,
  Note,
  NewNote,
  ActivityLog,
  TaskStatus,
  TaskPriority,
} from "@/lib/db/schema";

export interface TaskWithLabels {
  id: string;
  projectId: string;
  parentTaskId: string | null;
  title: string;
  description: string | null;
  status: "backlog" | "todo" | "in_progress" | "in_review" | "done";
  priority: "critical" | "high" | "medium" | "low";
  assignee: string | null;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  labels: { id: string; name: string; color: string }[];
  subtaskCount: number;
  subtaskDoneCount: number;
  commentCount: number;
}

export interface KanbanColumn {
  id: TaskWithLabels["status"];
  title: string;
  tasks: TaskWithLabels[];
}

export interface DashboardSummary {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  recentActivity: {
    id: string;
    action: string;
    details: string | null;
    taskTitle?: string;
    projectName?: string;
    createdAt: string;
  }[];
}

import type { TagTone } from "@/lib/colors";

export const TASK_STATUS_CONFIG = {
  backlog: { label: "Backlog", order: 0, color: "#94a3b8" },
  todo: { label: "To Do", order: 1, color: "#60a5fa" },
  in_progress: { label: "Working", order: 2, color: "#fbbf24" },
  in_review: { label: "In Review", order: 3, color: "#a78bfa" },
  done: { label: "Done", order: 4, color: "#4ade80" },
} as const;

export const TASK_PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "#f87171", tone: "rose" },
  high: { label: "High", color: "#fb923c", tone: "orange" },
  medium: { label: "Medium", color: "#fbbf24", tone: "amber" },
  low: { label: "Low", color: "#38bdf8", tone: "sky" },
} as const satisfies Record<
  string,
  { label: string; color: string; tone: TagTone }
>;
