import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: { include: { assignedTo: true }, orderBy: { createdAt: "desc" } } }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const name = body.name ? String(body.name).trim() : undefined;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(body.description !== undefined ? { description: body.description ? String(body.description) : null } : {})
    }
  });

  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
