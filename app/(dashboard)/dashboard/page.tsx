import { CheckCircle2, Clock3, FolderKanban, ListTodo, Timer } from "lucide-react";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { ROLES, STATUSES, type Status } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const taskWhere = user.role === ROLES.ADMIN ? {} : { assignedToId: user.id };

  const [projects, totalTasks, pending, inProgress, completed, recentTasks] = await Promise.all([
    user.role === ROLES.ADMIN ? prisma.project.count() : Promise.resolve(0),
    prisma.task.count({ where: taskWhere }),
    prisma.task.count({ where: { ...taskWhere, status: STATUSES.PENDING } }),
    prisma.task.count({ where: { ...taskWhere, status: STATUSES.IN_PROGRESS } }),
    prisma.task.count({ where: { ...taskWhere, status: STATUSES.COMPLETED } }),
    prisma.task.findMany({
      where: taskWhere,
      take: 6,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      include: { project: true, assignedTo: true }
    })
  ]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur animate-float-up">
        <h1 className="text-3xl font-black text-ink">Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-gray-600">Track workload, status, and upcoming due dates.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Projects" value={projects} icon={FolderKanban} />
        <StatCard label="Tasks" value={totalTasks} icon={ListTodo} />
        <StatCard label="Pending" value={pending} icon={Clock3} />
        <StatCard label="In progress" value={inProgress} icon={Timer} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} />
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-soft backdrop-blur animate-float-up">
        <div className="border-b border-line bg-gradient-to-r from-lavender to-skysoft px-5 py-4">
          <h2 className="font-extrabold text-ink">Upcoming tasks</h2>
        </div>
        <div className="divide-y divide-line">
          {recentTasks.length ? (
            recentTasks.map((task) => (
              <div key={task.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-medium text-ink">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.project.name}</p>
                </div>
                <StatusBadge status={task.status as Status} />
                <p className="text-sm text-gray-600">{formatDate(task.dueDate)}</p>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-gray-600">No tasks yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
