import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskTable } from "@/components/tasks/TaskTable";
import { getCurrentUser } from "@/lib/auth";
import { PRIORITIES, ROLES, STATUSES, type Priority, type Status } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TasksPageProps = {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    projectId?: string;
  }>;
};

function validStatus(value?: string) {
  return value && Object.values(STATUSES).includes(value as Status) ? (value as Status) : undefined;
}

function validPriority(value?: string) {
  return value && Object.values(PRIORITIES).includes(value as Priority) ? (value as Priority) : undefined;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const canManage = user.role === ROLES.ADMIN;
  const filters = await searchParams;
  const status = validStatus(filters.status);
  const priority = validPriority(filters.priority);
  const where: Prisma.TaskWhereInput = {
    ...(canManage ? {} : { assignedToId: user?.id }),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(filters.projectId ? { projectId: filters.projectId } : {})
  };

  const [projects, members, tasks] = await Promise.all([
    prisma.project.findMany({
      where: canManage ? {} : { tasks: { some: { assignedToId: user.id } } },
      orderBy: { name: "asc" }
    }),
    canManage ? prisma.user.findMany({ orderBy: [{ role: "asc" }, { email: "asc" }] }) : Promise.resolve([]),
    prisma.task.findMany({
      where,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      include: { project: true, assignedTo: true }
    })
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 rounded-3xl border border-white/70 bg-gradient-to-r from-blush via-white to-lavender p-5 shadow-sm animate-float-up">
        <h1 className="text-3xl font-black text-ink">Tasks</h1>
        <p className="mt-1 text-sm font-medium text-gray-600">
          {canManage ? "Create, assign, edit, and delete work items." : "View assigned tasks and update progress."}
        </p>
      </div>

      <div className="grid gap-6">
        {canManage ? <TaskForm projects={projects} members={members} /> : null}
        <TaskFilters projects={projects} />
        {user ? <TaskTable tasks={tasks} projects={projects} members={members} role={user.role} /> : null}
      </div>
    </div>
  );
}
