/**
 * Project Notes
 * List of markdown notes per project with preview and editor
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Plus, FileText, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NoteListItem {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectNotes({ projectId }: { projectId: string }) {
  const [noteList, setNoteList] = useState<NoteListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/notes?projectId=${projectId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setNoteList(data);
      })
      .catch(() => {});
  }, [projectId]);

  const fetchList = useCallback(async () => {
    const res = await fetch(`/api/notes?projectId=${projectId}`);
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) setNoteList(data);
  }, [projectId]);

  const fetchNote = useCallback(async (id: string) => {
    setIsLoading(true);
    const res = await fetch(`/api/notes/${id}`);
    const data = await res.json();
    setNote(data);
    setTitle(data.title);
    setContent(data.content || "");
    setEditing(false);
    setPreview(true);
    setIsLoading(false);
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, title: "Untitled" }),
    });
    const created = await res.json();
    await fetchList();
    setSelectedId(created.id);
    fetchNote(created.id);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!selectedId) return;
    await fetch(`/api/notes/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    await fetchList();
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await fetch(`/api/notes/${selectedId}`, { method: "DELETE" });
    setSelectedId(null);
    setNote(null);
    await fetchList();
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex w-56 flex-col border-r border-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-semibold">Notes</span>
          <Button size="icon" variant="ghost" onClick={handleCreate} title="New note">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {noteList.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setSelectedId(n.id);
                fetchNote(n.id);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted ${
                selectedId === n.id ? "bg-muted" : ""
              }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{n.title}</span>
            </button>
          ))}
          {noteList.length === 0 && (
            <p className="px-3 py-4 text-xs text-muted-foreground">No notes yet.</p>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {!note ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a note or create one.
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              {editing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 max-w-xs font-semibold"
                />
              ) : (
                <h3 className="font-semibold">{note.title}</h3>
              )}
              <div className="flex items-center gap-1">
                {editing ? (
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(true);
                        setPreview(false);
                      }}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleDelete} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Separator />
            {editing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none rounded-none border-none font-mono text-sm focus-visible:ring-0"
                placeholder="Write markdown here..."
              />
            ) : preview ? (
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{note.content || ""}</ReactMarkdown>
                </div>
              </ScrollArea>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
