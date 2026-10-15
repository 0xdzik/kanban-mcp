/**
 * Task Dialog
 * Create/edit task with title, description, status, priority
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from "@/types";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onStatusChange?: (status: string) => Promise<void>;
  onPriorityChange?: (priority: string) => Promise<void>;
  mode: "create" | "edit";
  defaultTitle?: string;
  defaultDescription?: string;
  defaultStatus?: string;
  defaultPriority?: string;
}

export default function TaskDialog({
  open,
  onClose,
  onSubmit,
  onDelete,
  onStatusChange,
  onPriorityChange,
  mode,
  defaultTitle = "",
  defaultDescription = "",
  defaultStatus = "backlog",
  defaultPriority = "medium",
}: TaskDialogProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    await onSubmit(title.trim(), description.trim());
    setIsSubmitting(false);
    if (mode === "create") {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="gap-0 border-[#222] bg-card p-0 sm:p-0">
        <DialogHeader className="flex flex-col gap-2 border-b border-[#222] px-6 py-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>Board</span>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">
              {mode === "create" ? "New Task" : "Edit Task"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label htmlFor="task-title" className="sr-only">
              Title
            </label>
            <Input
              id="task-title"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              autoFocus
              className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-2xl font-bold text-foreground shadow-none placeholder:text-gray-600 focus-visible:border-none focus-visible:ring-0 dark:bg-transparent md:text-2xl"
            />
          </div>

          <div>
            <label htmlFor="task-description" className="sr-only">
              Description
            </label>
            <Textarea
              id="task-description"
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="min-h-[180px] resize-none rounded-lg border border-[#333] bg-[#1a1a1a] p-5 text-sm leading-relaxed text-foreground shadow-none placeholder:text-gray-600 focus-visible:border-primary focus-visible:ring-0 dark:bg-[#1a1a1a]"
            />
          </div>

          {mode === "edit" && (
            <>
              <div className="rounded-xl border border-[#222] bg-card p-5">
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(TASK_STATUS_CONFIG) as [
                      string,
                      { label: string; color: string },
                    ][]
                  ).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => onStatusChange?.(key)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 bg-[#202020] text-sm font-medium transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        defaultStatus === key
                          ? "border-primary text-foreground"
                          : "border-[#333] text-muted-foreground hover:border-gray-500 hover:text-foreground"
                      }`}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: config.color }}
                        aria-hidden="true"
                      />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#222] bg-card p-5">
                <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Priority
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(TASK_PRIORITY_CONFIG) as [
                      string,
                      { label: string; color: string },
                    ][]
                  ).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => onPriorityChange?.(key)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 bg-[#202020] text-sm font-medium transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        defaultPriority === key
                          ? "border-primary text-foreground"
                          : "border-[#333] text-muted-foreground hover:border-gray-500 hover:text-foreground"
                      }`}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: config.color }}
                        aria-hidden="true"
                      />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <DialogFooter className="flex flex-row items-center justify-between gap-3 border-t border-[#222] pt-6">
            {mode === "edit" && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-9 gap-1.5 rounded-lg px-3 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Task
              </Button>
            )}
            <div className="ml-auto flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-10 rounded-lg border-[#333] px-5 text-sm font-medium text-gray-300 shadow-none dark:bg-transparent hover:bg-secondary hover:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim()}
                className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none hover:bg-[#9be52a]"
              >
                {mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
