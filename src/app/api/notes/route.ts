/**
 * Notes API
 * GET: List notes for a project
 * POST: Create a new note
 */

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const allNotes = await db
      .select({
        id: notes.id,
        projectId: notes.projectId,
        title: notes.title,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .where(eq(notes.projectId, projectId))
      .orderBy(desc(notes.updatedAt));

    return NextResponse.json(allNotes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const id = uuid();

    const newNote = {
      id,
      projectId: body.projectId,
      title: body.title || "Untitled",
      content: body.content || "",
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(notes).values(newNote);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
