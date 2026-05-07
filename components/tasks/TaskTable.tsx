"use client";

import { Project, Task, User } from "@prisma/client";
import { CheckCircle2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PRIORITIES, ROLES, STATUSES, type Role, type Priority, type Status } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type TaskWithRelations = Task & {
  project: Project;
  assignedTo: User | null;
};

export function TaskTable({
  tasks,
  projects,
  members,
  role
}: {
  tasks: TaskWithRelations[];
  projects: Project[];
  members: User[];
  role: Role;
}) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>, taskId: string) {
    event.preventDefault();
    setSavingId(taskId);
    const formData = new FormData(event.currentTarget);
    const payload =
      role === ROLES.ADMIN
        ? {
            title: formData.get("title"),
            description: formData.get("description"),
            status: formData.get("status"),
            priority: formData.get("priority"),
            dueDate: formData.get("dueDate"),
            projectId: formData.get("projectId"),
            assignedToId: formData.get("assignedToId")
          }
        : { status: formData.get("status") };

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSavingId(null);
    router.refresh();
  }

  async function markCompleted(taskId: string) {
    setSavingId(taskId);
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: STATUSES.COMPLETED })
    });
    setSavingId(null);
    router.refresh();
  }

  async function remove(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    router.refresh();
  }

  if (!tasks.length) {
    return <div className="rounded-3xl border border-white/80 bg-white/80 p-8 text-sm font-medium text-gray-600 shadow-sm animate-float-up">No tasks found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-soft backdrop-blur animate-float-up">
      <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-3 border-b border-line bg-gradient-to-r from-lavender to-skysoft px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-600 lg:grid">
        <span>Task</span>
        <span>Project</span>
        <span>Assignee</span>
        <span>Status</span>
        <span>Due</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-line">
        {tasks.map((task) => {
          const isCompleted = task.status === STATUSES.COMPLETED;
          const assigneeName = task.assignedTo?.name ?? task.assignedTo?.email ?? "Unassigned";

          return (
            <form
              key={task.id}
              onSubmit={(event) => save(event, task.id)}
              className={`grid gap-3 px-4 py-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] lg:items-center ${
                isCompleted ? "bg-mint/30" : ""
              }`}
            >
              <div>
                {role === ROLES.ADMIN ? (
                  <>
                    <input name="title" defaultValue={task.title} required className="w-full rounded-md border-line text-sm font-medium" />
                    <input
                      name="description"
                      defaultValue={task.description ?? ""}
                      className="mt-2 w-full rounded-md border-line text-sm"
                      placeholder="Description"
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium text-ink">{task.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{task.description || "No description"}</p>
                  </>
                )}
              </div>

              <div>
                {role === ROLES.ADMIN ? (
                  <select name="projectId" defaultValue={task.projectId} className="w-full rounded-md border-line text-sm">
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-700">{task.project.name}</p>
                )}
              </div>

              <div>
                {role === ROLES.ADMIN ? (
                  <select name="assignedToId" defaultValue={task.assignedToId ?? ""} className="w-full rounded-md border-line text-sm">
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name ?? member.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-700">{assigneeName}</p>
                )}
              </div>

              <div>
                <select name="status" defaultValue={task.status} className="w-full rounded-md border-line text-sm">
                  {Object.values(STATUSES).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <StatusBadge status={task.status as Status} />
                </div>
                {role === ROLES.ADMIN && isCompleted ? (
                  <p className="mt-2 text-xs font-semibold text-success">Completed by {assigneeName}</p>
                ) : null}
              </div>

              <div>
                {role === ROLES.ADMIN ? (
                  <>
                    <select name="priority" defaultValue={task.priority} className="mb-2 w-full rounded-md border-line text-sm">
                      {Object.values(PRIORITIES).map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                    <input
                      name="dueDate"
                      type="date"
                      defaultValue={task.dueDate ? task.dueDate.toISOString().slice(0, 10) : ""}
                      className="w-full rounded-md border-line text-sm"
                    />
                  </>
                ) : (
                  <>
                    <PriorityBadge priority={task.priority as Priority} />
                    <p className="mt-2 text-sm text-gray-600">{formatDate(task.dueDate)}</p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {role === ROLES.MEMBER && !isCompleted ? (
                  <button
                    type="button"
                    onClick={() => markCompleted(task.id)}
                    disabled={savingId === task.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-success text-white hover:bg-emerald-600 disabled:opacity-60"
                    title="Mark completed"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={savingId === task.id}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white hover:bg-violet-500 disabled:opacity-60"
                  title="Save task"
                >
                  <Save className="h-4 w-4" />
                </button>
                {role === ROLES.ADMIN ? (
                  <button
                    type="button"
                    onClick={() => remove(task.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-danger hover:bg-blush"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
