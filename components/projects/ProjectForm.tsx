"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function ProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description")
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to create project");
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/80 bg-gradient-to-br from-white via-lavender/50 to-skysoft p-5 shadow-soft backdrop-blur animate-float-up">
      <h2 className="mb-4 text-xl font-black text-ink">New project</h2>
      <label className="mb-3 block text-sm font-medium">
        Name
        <input name="name" required className="mt-1 w-full rounded-md border-line" placeholder="Website redesign" />
      </label>
      <label className="mb-4 block text-sm font-medium">
        Description
        <textarea name="description" rows={3} className="mt-1 w-full rounded-md border-line" placeholder="Scope and goals" />
      </label>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      <Button disabled={loading}>{loading ? "Creating..." : "Create project"}</Button>
    </form>
  );
}
