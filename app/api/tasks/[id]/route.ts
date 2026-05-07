import { NextResponse } from "next/server";
import { PRIORITIES, ROLES, STATUSES, type Priority, type Status } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

function statusValue(value: unknown) {
  return Object.values(STATUSES).includes(String(value) as Status) ? (String(value) as Status) : null;
}

function priorityValue(value: unknown) {
  return Object.values(PRIORITIES).includes(String(value) as Priority) ? (String(value) as Priority) : null;
}

export async function PATCH(request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const status = statusValue(body.status);

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (user.role === ROLES.MEMBER) {
    if (task.assignedToId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!status) {
      return NextResponse.json({ error: "Members can update status only" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: { project: true, assignedTo: true }
    });

    return NextResponse.json({ task: updatedTask });
  }

  const priority = priorityValue(body.priority);
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: String(body.title).trim() } : {}),
      ...(body.description !== undefined ? { description: body.description ? String(body.description) : null } : {}),
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(body.dueDate !== undefined ? { dueDate: body.dueDate ? new Date(body.dueDate) : null } : {}),
      ...(body.projectId !== undefined ? { projectId: String(body.projectId) } : {}),
      ...(body.assignedToId !== undefined
        ? { assignedToId: body.assignedToId ? String(body.assignedToId) : null }
        : {})
    },
    include: { project: true, assignedTo: true }
  });

  return NextResponse.json({ task: updatedTask });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
