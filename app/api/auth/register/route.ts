import { NextResponse } from "next/server";
import { ROLES } from "@/lib/constants";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";

function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Account already exists. Please sign in." }, { status: 409 });
  }

  const existingCount = await prisma.user.count();
  const role = adminEmails().includes(email) || existingCount === 0 ? ROLES.ADMIN : ROLES.MEMBER;
  const user = await prisma.user.create({
    data: {
      authId: `local:${email}`,
      email,
      name: name || null,
      password: hashPassword(password),
      role
    }
  });

  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  setSessionCookie(response, user.id);
  return response;
}
