/**
 * Task Detail Panel
 * Full task view with tabs: Details, Comments, Activity, Sub-tasks
 */

"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Activity,
  ListChecks,
  Tag as TagIcon,
  Send,
  Trash2,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  Save,
  X,
  Sparkles,
  ArrowUp,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  colorFromString,
  mixWithBlack,
  outlineColorStyle,
  softColorStyle,
} from "@/lib/colors";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from "@/types";
import type { TaskWithLabels } from "@/types";

interface Comment {
  id: string;
  taskId: string;
  content: string;
  author: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  actor: string;
  createdAt: string;
}

interface Label {
  id: string;
  projectId: string;
  name: string;
  color: string;
}

interface TaskDetailPanelProps {
  task: TaskWithLabels | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<TaskWithLabels>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  projectId: string;
}

const ACTION_LABELS: Record<string, string> = {
  task_created: "Created",
  status_changed: "Status changed",
  priority_changed: "Priority changed",
  task_deleted: "Deleted",
};

/** Tab chrome per the design: bottom-ruled, lime accent when active. */
const TAB_TRIGGER_CLASSES =
  "group flex-none rounded-none border-x-0 border-t-0 border-b-2 border-transparent px-1 pb-3 pt-2 text-sm font-medium text-muted-foreground hover:text-foreground after:hidden after:opacity-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-primary";

export default function TaskDetailPanel({
  task,
  open,
  onClose,
  onUpdate,
  onDelete,
  projectId,
}: TaskDetailPanelProps) {
  const [draft, setDraft] = useState<{
    taskId: string;
    title: string;
    description: string;
  } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [subtasks, setSubtasks] = useState<TaskWithLabels[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!task || !open) return;
    fetch(`/api/comments?taskId=${task.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      });
    fetch(`/api/activity?taskId=${task.id}&limit=20`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
      });
    if (projectId) {
      fetch(`/api/tasks?projectId=${projectId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            setSubtasks(
              data.filter((t: TaskWithLabels) => t.parentTaskId === task.id),
            );
          }
        });
      fetch(`/api/labels?projectId=${projectId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) setLabels(data);
        });
    }
  }, [task, open, projectId]);

  if (!task) return null;

  const isEditing = draft?.taskId === task.id;

  const startEditing = () =>
    setDraft({
      taskId: task.id,
      title: task.title,
      description: task.description || "",
    });

  const cancelEditing = () => setDraft(null);

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    await onUpdate(draft.taskId, {
      title: draft.title,
      description: draft.description,
    });
    setDraft(null);
    setIsSaving(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: task.id,
        content: newComment.trim(),
        author: "user",
      }),
    });
    setNewComment("");
    fetch(`/api/comments?taskId=${task.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      });
  };

  const handleDeleteComment = async (commentId: string) => {
    await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    fetch(`/api/comments?taskId=${task.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      });
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        title: newSubtaskTitle.trim(),
        parentTaskId: task.id,
        status: "todo",
        priority: "medium",
      }),
    });
    setNewSubtaskTitle("");
    loadSubtasks();
  };

  const loadSubtasks = () => {
    if (!task || !projectId) return;
    fetch(`/api/tasks?projectId=${projectId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setSubtasks(
            data.filter((t: TaskWithLabels) => t.parentTaskId === task.id),
          );
        }
      });
  };

  const handleToggleSubtask = async (subtask: TaskWithLabels) => {
    const newStatus = subtask.status === "done" ? "todo" : "done";
    await fetch(`/api/tasks/${subtask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadSubtasks();
  };

  const statusConfig =
    TASK_STATUS_CONFIG[task.status as keyof typeof TASK_STATUS_CONFIG];
  const priorityConfig =
    TASK_PRIORITY_CONFIG[task.priority as keyof typeof TASK_PRIORITY_CONFIG];
  const completedSubtasks = subtasks.filter((s) => s.status === "done").length;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-3">
              {isEditing && draft ? (
                <Input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className="rounded-lg border-[#333] bg-[#1a1a1a] text-lg font-bold dark:bg-[#1a1a1a]"
                  autoFocus
                />
              ) : (
                <SheetTitle
                  className="cursor-pointer pr-8 text-2xl font-bold leading-tight tracking-tight text-foreground"
                  onClick={startEditing}
                >
                  {task.title}
                </SheetTitle>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#202020] px-3 py-1.5 text-sm font-medium text-gray-300">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: statusConfig?.color,
                      boxShadow: `0 0 8px ${statusConfig?.color ?? "transparent"}`,
                    }}
                  />
                  {statusConfig?.label}
                </span>
                <span className="h-4 w-px bg-[#333]" aria-hidden="true" />
                <span className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#202020] px-3 py-1.5 text-sm font-medium text-gray-300">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: priorityConfig?.color }}
                  />
                  {priorityConfig?.label}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Metadata card: status, priority, due date */}
        <div className="mx-6 space-y-6 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                Object.entries(TASK_STATUS_CONFIG) as [
                  string,
                  { label: string; color: string },
                ][]
              ).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() =>
                    onUpdate(task.id, {
                      status: key as TaskWithLabels["status"],
                    })
                  }
                  aria-pressed={task.status === key}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                    task.status === key
                      ? "border-primary/50 bg-primary/5 text-foreground"
                      : "border-[#2a2a2a] bg-[#202020] text-muted-foreground hover:border-gray-500 hover:text-foreground",
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: config.color,
                      boxShadow: `0 0 8px ${config.color}80`,
                    }}
                  />
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Priority
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                Object.entries(TASK_PRIORITY_CONFIG) as [
                  string,
                  { label: string; color: string },
                ][]
              ).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() =>
                    onUpdate(task.id, {
                      priority: key as TaskWithLabels["priority"],
                    })
                  }
                  aria-pressed={task.priority === key}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                    task.priority === key
                      ? "border-primary/50 bg-primary/5 text-foreground"
                      : "border-[#2a2a2a] bg-[#202020] text-muted-foreground hover:border-gray-500 hover:text-foreground",
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: config.color,
                      boxShadow: `0 0 8px ${config.color}80`,
                    }}
                  />
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          {task.dueDate && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Timeline
              </span>
              <div className="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#202020] px-4 py-3">
                <div className="absolute inset-0 bg-primary/5" aria-hidden="true" />
                <div className="relative flex items-center gap-3">
                  <CalendarCheck className="h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Due Date
                    </div>
                    <div className="tabular-readout text-sm font-medium text-primary">
                      {new Date(task.dueDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Tabs
          defaultValue="details"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="border-b border-border px-6">
            <TabsList
              variant="line"
              className="group-data-[orientation=horizontal]/tabs:h-auto justify-start gap-6 rounded-none bg-transparent p-0"
            >
              <TabsTrigger value="details" className={TAB_TRIGGER_CLASSES}>
                <ListChecks className="size-3.5" />
                Details
              </TabsTrigger>
              <TabsTrigger value="comments" className={TAB_TRIGGER_CLASSES}>
                <MessageSquare className="size-3.5" />
                Comments
                <span className="tabular-readout rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary">
                  {comments.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="activity" className={TAB_TRIGGER_CLASSES}>
                <Activity className="size-3.5" />
                Activity
                <span className="tabular-readout rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary">
                  {activities.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Details + Sub-tasks Tab */}
          <TabsContent value="details" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-6 py-3">
              {/* Description */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Description
                </span>
                {isEditing && draft ? (
                  <div className="space-y-2">
                    <Textarea
                      value={draft.description}
                      onChange={(e) =>
                        setDraft({ ...draft, description: e.target.value })
                      }
                      rows={5}
                      placeholder="Describe the task..."
                      className="rounded-xl border-[#333] bg-[#1a1a1a] text-sm leading-relaxed dark:bg-[#1a1a1a]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-lg font-medium"
                      >
                        <Save className="mr-1 h-3.5 w-3.5" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        className="rounded-lg border-[#333] text-gray-300 hover:bg-secondary hover:text-gray-300"
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    className={cn(
                      "cursor-pointer whitespace-pre-wrap rounded-2xl border border-[#262626] bg-[#161616] p-6 text-sm leading-relaxed transition-colors hover:border-gray-600",
                      task.description
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                    onClick={startEditing}
                  >
                    {task.description || "Click to add description..."}
                  </p>
                )}
              </div>

              {/* Labels */}
              <div className="space-y-2 mb-6">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <TagIcon className="h-3.5 w-3.5" />
                  Labels
                </span>
                <div className="flex flex-wrap gap-2">
                  {task.labels?.map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex whitespace-nowrap rounded-lg border px-3 py-1.5 text-[11px] font-semibold"
                      style={softColorStyle(label.color)}
                    >
                      {label.name}
                    </span>
                  ))}
                  {labels
                    .filter((l) => !task.labels?.some((tl) => tl.id === l.id))
                    .map((label) => (
                      <button
                        key={label.id}
                        className="opacity-60 transition-opacity hover:opacity-100"
                        onClick={async () => {
                          await fetch("/api/task-labels", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              taskId: task.id,
                              labelId: label.id,
                            }),
                          });
                          // Refresh parent
                          fetch(`/api/labels?projectId=${projectId}`)
                            .then((res) => (res.ok ? res.json() : null))
                            .then((data) => {
                              if (Array.isArray(data)) setLabels(data);
                            });
                        }}
                      >
                        <span
                          className="inline-flex whitespace-nowrap rounded-lg border border-dashed px-3 py-1.5 text-[11px] font-semibold"
                          style={outlineColorStyle(label.color)}
                        >
                          + {label.name}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Sub-tasks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <ListChecks className="h-3.5 w-3.5" />
                    Sub-tasks
                    {subtasks.length > 0 && (
                      <span className="tabular-readout text-[11px]">
                        ({completedSubtasks}/{subtasks.length})
                      </span>
                    )}
                  </span>
                </div>

                {subtasks.length > 0 && (
                  <div className="h-1.5 rounded-full bg-muted mb-2">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                )}

                <div className="space-y-0.5">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-secondary"
                    >
                      <button
                        onClick={() => handleToggleSubtask(subtask)}
                        className="flex-shrink-0"
                      >
                        {subtask.status === "done" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          subtask.status === "done"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Add sub-task..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubtask();
                    }}
                    className="h-9 rounded-lg border-[#333] bg-[#1a1a1a] text-sm dark:bg-[#1a1a1a]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    className="h-9 rounded-lg border-dashed border-[#333] px-3 text-gray-400 hover:bg-secondary hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Delete */}
              <Separator className="my-4" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                className="w-full rounded-lg border border-[#333] bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive dark:bg-transparent dark:hover:bg-destructive/10"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete Task
              </Button>
            </ScrollArea>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent
            value="comments"
            className="flex-1 overflow-hidden mt-0 flex flex-col"
          >
            <ScrollArea className="flex-1 px-6 py-4">
              {comments.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#333] px-4 py-10 text-center text-sm text-muted-foreground">
                  No comments yet
                </p>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <span
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] text-xs font-bold text-white"
                        style={{
                          backgroundColor: mixWithBlack(
                            colorFromString(comment.author),
                            0.15,
                          ),
                        }}
                        aria-hidden="true"
                      >
                        {comment.author.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {comment.author}
                          </span>
                          <span className="tabular-readout text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <div className="rounded-xl rounded-tl-none border border-[#2a2a2a] bg-[#202020] p-4 text-[13.5px] leading-relaxed text-gray-300 shadow-sm">
                          <p className="whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            aria-label="Delete comment"
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="border-t border-border px-6 py-4">
              <div className="overflow-hidden rounded-xl border border-[#333] bg-card shadow-sm transition-colors focus-within:border-primary/50">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  className="h-11 border-0 bg-transparent px-4 text-[13px] shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent md:text-[13px]"
                />
                <div className="flex items-center justify-between border-t border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5">
                  <span className="px-1 text-xs text-muted-foreground">
                    Press Enter to send
                  </span>
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="h-auto rounded-lg bg-primary px-4 py-1.5 text-[13px] font-semibold text-primary-foreground hover:bg-[#9be52a]"
                  >
                    Comment
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full px-6 py-4">
              {activities.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#333] px-4 py-10 text-center text-sm text-muted-foreground">
                  No activity yet
                </p>
              ) : (
                <div className="relative space-y-6 pb-4">
                  {/* Vertical thread line */}
                  <div
                    className="absolute bottom-0 left-[17px] top-4 w-px bg-[#262626]"
                    aria-hidden="true"
                  />
                  {activities.map((activity) => {
                    const details = activity.details
                      ? JSON.parse(activity.details)
                      : {};
                    const toStatus = details.to
                      ? TASK_STATUS_CONFIG[
                          details.to as keyof typeof TASK_STATUS_CONFIG
                        ]
                      : undefined;
                    const toPriority = details.to
                      ? TASK_PRIORITY_CONFIG[
                          details.to as keyof typeof TASK_PRIORITY_CONFIG
                        ]
                      : undefined;
                    let icon;
                    switch (activity.action) {
                      case "task_created":
                        icon = (
                          <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                        );
                        break;
                      case "status_changed":
                        icon = (
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: toStatus?.color ?? "#6b7280",
                            }}
                          />
                        );
                        break;
                      case "priority_changed":
                        icon = (
                          <ArrowUp
                            className="h-3.5 w-3.5"
                            style={{ color: toPriority?.color }}
                          />
                        );
                        break;
                      case "task_deleted":
                        icon = <Trash2 className="h-3.5 w-3.5 text-red-400" />;
                        break;
                      default:
                        icon = (
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        );
                    }
                    return (
                      <div key={activity.id} className="relative z-10 flex gap-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#161616]">
                          {icon}
                        </div>
                        <div className="min-w-0 pt-2 text-[13px] leading-relaxed text-muted-foreground">
                          <p>
                            <span className="font-semibold text-gray-300">
                              {ACTION_LABELS[activity.action] ||
                                activity.action}
                            </span>
                            {" by "}
                            <span className="font-semibold text-gray-300">
                              {activity.actor}
                            </span>
                            <span className="tabular-readout ml-2 text-xs text-muted-foreground">
                              {new Date(activity.createdAt).toLocaleString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </p>
                          {details.from && details.to && (
                            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="rounded bg-[#222] px-1.5 py-0.5 font-medium text-gray-300">
                                {details.from}
                              </span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="rounded bg-[#222] px-1.5 py-0.5 font-medium text-foreground">
                                {details.to}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
