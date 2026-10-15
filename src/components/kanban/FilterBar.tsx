/**
 * Filter Bar
 * Header controls for the kanban board: search input, priority filter
 * buttons, and CSV export.
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Download, Search, X } from "lucide-react";
import { TASK_PRIORITY_CONFIG } from "@/types";

interface FilterBarProps {
  onSearchChange: (query: string) => void;
  onPriorityFilter: (priority: string | null) => void;
  activePriority: string | null;
  projectId: string;
}

export default function FilterBar({
  onSearchChange,
  onPriorityFilter,
  activePriority,
  projectId,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleExport = () => {
    window.open(`/api/export?projectId=${projectId}`, "_blank");
  };

  return (
    <div className="flex items-center gap-3 border-b border-border px-8 py-2.5">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 rounded-lg border-[#333] pl-8 pr-8 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Priority filter */}
      <div className="flex items-center gap-1">
        <span className="mr-1 text-sm text-muted-foreground">Priority</span>
        {(
          Object.entries(TASK_PRIORITY_CONFIG) as [string, { label: string }][]
        ).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onPriorityFilter(activePriority === key ? null : key)}
            aria-pressed={activePriority === key}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
              activePriority === key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {config.label}
          </button>
        ))}
        {activePriority && (
          <button
            onClick={() => onPriorityFilter(null)}
            aria-label="Clear priority filter"
            className="ml-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Export */}
      <button
        onClick={handleExport}
        aria-label="Export tasks as CSV"
        className="ml-auto flex h-8 items-center gap-1.5 rounded-lg border border-[#333] px-3 text-sm text-gray-300 transition-colors hover:bg-secondary"
      >
        <Download className="h-3.5 w-3.5" />
        <span>CSV</span>
      </button>
    </div>
  );
}
