"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-2xl bg-blush px-2 text-xs font-bold text-danger transition hover:-translate-y-0.5 hover:bg-rose-100"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
