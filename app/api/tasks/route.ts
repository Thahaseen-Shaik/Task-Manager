import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { PRIORITIES, ROLES, STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";

function enumValue<T extends Record<string, string>>(values: T, value: unknown, fallback: T[keyof T]) {
  return Object.values(values).includes(String(value)) ? (String(value) as T[keyof T]) : fallback;
}

export async function GET() {
  const { user, response } = await requireUser();
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where: Prisma.TaskWhereInput = user.role === ROLES.ADMIN ? {} : { assignedToId: user.id };
  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    include: { project: true, assignedTo: true }
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const projectId = String(body.projectId ?? "");

  if (!title || !projectId) {
    return NextResponse.json({ error: "Title and project are required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: body.description ? String(body.description) : null,
      status: enumValue(STATUSES, body.status, STATUSES.PENDING),
      priority: enumValue(PRIORITIES, body.priority, PRIORITIES.MEDIUM),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      projectId,
      assignedToId: body.assignedToId ? String(body.assignedToId) : null
    },
    include: { project: true, assignedTo: true }
  });

  return NextResponse.json({ task }, { status: 201 });
}
