import { NextResponse } from "next/server";
import { ROLES, type Role } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  authId: string;
  email: string;
  name: string | null;
  role: Role;
};

function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeRole(role: string): Role {
  return Object.values(ROLES).includes(role as Role) ? (role as Role) : ROLES.MEMBER;
}

function toCurrentUser(user: {
  id: string;
  authId: string;
  email: string;
  name: string | null;
  role: string;
}): CurrentUser {
  return {
    id: user.id,
    authId: user.authId,
    email: user.email,
    name: user.name,
    role: normalizeRole(user.role)
  };
}

export async function getSupabaseUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  return user;
}

export async function syncCurrentUser(): Promise<CurrentUser | null> {
  const sessionUserId = await getSessionUserId();
  if (sessionUserId) {
    const user = await prisma.user.findUnique({ where: { id: sessionUserId } });
    return user ? toCurrentUser(user) : null;
  }

  const authUser = await getSupabaseUser();

  if (!authUser?.email) {
    return null;
  }

  const email = authUser.email.toLowerCase();
  const existingCount = await prisma.user.count();
  const role = adminEmails().includes(email) || existingCount === 0 ? ROLES.ADMIN : ROLES.MEMBER;

  const user = await prisma.user.upsert({
    where: { authId: authUser.id },
    update: {
      email,
      name: authUser.user_metadata?.name ?? authUser.user_metadata?.full_name ?? null
    },
    create: {
      authId: authUser.id,
      email,
      name: authUser.user_metadata?.name ?? authUser.user_metadata?.full_name ?? null,
      role
    }
  });

  return toCurrentUser(user);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sessionUserId = await getSessionUserId();
  if (sessionUserId) {
    const user = await prisma.user.findUnique({ where: { id: sessionUserId } });
    return user ? toCurrentUser(user) : null;
  }

  const authUser = await getSupabaseUser();

  if (!authUser?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { authId: authUser.id }
  });

  return user ? toCurrentUser(user) : null;
}

export async function requireUser() {
  const user = await syncCurrentUser();

  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { user, response: null };
}

export async function requireAdmin() {
  const { user, response } = await requireUser();

  if (response || !user) {
    return { user: null, response };
  }

  if (user.role !== ROLES.ADMIN) {
    return { user, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user, response: null };
}
