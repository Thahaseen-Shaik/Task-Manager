import { redirect } from "next/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== ROLES.ADMIN) redirect("/tasks");

  const canManage = user.role === ROLES.ADMIN;
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tasks: true } } }
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-3xl border border-white/70 bg-gradient-to-r from-skysoft via-white to-blush p-5 shadow-sm md:flex-row md:items-end animate-float-up">
        <div>
          <h1 className="text-3xl font-black text-ink">Projects</h1>
          <p className="mt-1 text-sm font-medium text-gray-600">Create workspaces and organize team tasks.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {canManage ? <ProjectForm /> : null}
        <section className={canManage ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} canManage={canManage} />
          ))}
          {!projects.length ? <p className="text-sm text-gray-600">No projects yet.</p> : null}
        </section>
      </div>
    </div>
  );
}
