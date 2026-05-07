"use client";

import { Project } from "@prisma/client";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PRIORITIES, STATUSES } from "@/lib/constants";

export function TaskFilters({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    ["status", "priority", "projectId"].forEach((key) => {
      const value = String(formData.get(key) ?? "");
      if (value) params.set(key, value);
    });

    router.push(`/tasks${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={applyFilters} className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur animate-float-up">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-end">
        <label className="text-sm font-medium">
          Status
          <select name="status" defaultValue={searchParams.get("status") ?? ""} className="mt-1 w-full rounded-md border-line">
            <option value="">All statuses</option>
            {Object.values(STATUSES).map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Priority
          <select name="priority" defaultValue={searchParams.get("priority") ?? ""} className="mt-1 w-full rounded-md border-line">
            <option value="">All priorities</option>
            {Object.values(PRIORITIES).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Project
          <select name="projectId" defaultValue={searchParams.get("projectId") ?? ""} className="mt-1 w-full rounded-md border-line">
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <Button className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/tasks")}>
          Reset
        </Button>
      </div>
    </form>
  );
}
