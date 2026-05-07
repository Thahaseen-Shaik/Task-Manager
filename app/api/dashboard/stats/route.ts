import { NextResponse } from "next/server";
import { ROLES, STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const { user, response } = await requireUser();
  if (response) return response;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const taskWhere = user.role === ROLES.ADMIN ? {} : { assignedToId: user.id };
  const [projects, totalTasks, pending, inProgress, completed] = await Promise.all([
    user.role === ROLES.ADMIN ? prisma.project.count() : Promise.resolve(0),
    prisma.task.count({ where: taskWhere }),
    prisma.task.count({ where: { ...taskWhere, status: STATUSES.PENDING } }),
    prisma.task.count({ where: { ...taskWhere, status: STATUSES.IN_PROGRESS } }),
    prisma.task.count({ where: { ...taskWhere, status: STATUSES.COMPLETED } })
  ]);

  return NextResponse.json({
    stats: {
      projects,
      totalTasks,
      pending,
      inProgress,
      completed
    }
  });
}
