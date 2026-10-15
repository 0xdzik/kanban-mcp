/**
 * Activity Log API
 * GET: List activity for a task or project
 */

import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");
    const projectId = searchParams.get("projectId");
    const limit = parseInt(searchParams.get("limit") || "30");

    let where = undefined;
    if (taskId) {
      where = eq(activityLog.taskId, taskId);
    } else if (projectId) {
      where = eq(activityLog.projectId, projectId);
    }

    const activities = await db
      .select()
      .from(activityLog)
      .where(where)
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
