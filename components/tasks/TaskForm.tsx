"use client";

import { Project, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PRIORITIES, STATUSES } from "@/lib/constants";

export function TaskForm({ projects, members }: { projects: Project[]; members: User[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        dueDate: formData.get("dueDate"),
        projectId: formData.get("projectId"),
        assignedToId: formData.get("assignedToId")
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to create task");
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-blush/40 to-lavender/60 p-5 shadow-soft backdrop-blur animate-float-up">
      <h2 className="mb-4 text-xl font-black text-ink">New task</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium md:col-span-2">
          Title
          <input name="title" required className="mt-1 w-full rounded-md border-line" placeholder="Prepare sprint plan" />
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Description
          <textarea name="description" rows={3} className="mt-1 w-full rounded-md border-line" placeholder="Task details" />
        </label>
        <label className="block text-sm font-medium">
          Project
          <select name="projectId" required className="mt-1 w-full rounded-md border-line">
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Assignee
          <select name="assignedToId" className="mt-1 w-full rounded-md border-line">
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name ?? member.email}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Status
          <select name="status" defaultValue={STATUSES.PENDING} className="mt-1 w-full rounded-md border-line">
            {Object.values(STATUSES).map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Priority
          <select name="priority" defaultValue={PRIORITIES.MEDIUM} className="mt-1 w-full rounded-md border-line">
            {Object.values(PRIORITIES).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Due date
          <input name="dueDate" type="date" className="mt-1 w-full rounded-md border-line" />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <Button className="mt-4" disabled={loading || !projects.length}>
        {loading ? "Creating..." : "Create task"}
      </Button>
    </form>
  );
}
