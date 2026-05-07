"use client";

import { Project } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

type ProjectWithCount = Project & { _count: { tasks: number } };

export function ProjectCard({ project, canManage }: { project: ProjectWithCount; canManage: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.get("name"), description: formData.get("description") })
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this project and its tasks?")) return;
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={save} className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur">
        <input name="name" defaultValue={project.name} required className="w-full rounded-md border-line text-sm font-medium" />
        <textarea
          name="description"
          defaultValue={project.description ?? ""}
          rows={3}
          className="mt-3 w-full rounded-md border-line text-sm"
        />
        <div className="mt-4 flex gap-2">
          <Button disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <article className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-skysoft/60 to-blush/50 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-soft animate-float-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-ink">{project.name}</h2>
          <p className="mt-2 text-sm text-gray-600">{project.description || "No description"}</p>
        </div>
        {canManage ? (
          <div className="flex gap-1">
            <button onClick={() => setEditing(true)} className="rounded-md p-2 text-gray-600 hover:bg-lavender" title="Edit project">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={remove} className="rounded-md p-2 text-danger hover:bg-blush" title="Delete project">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
      <p className="mt-5 w-fit rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-brand">{project._count.tasks} tasks</p>
    </article>
  );
}
