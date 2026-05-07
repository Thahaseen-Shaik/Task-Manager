import Link from "next/link";
import { FolderKanban, LayoutDashboard, ListTodo } from "lucide-react";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { ROLES, type Role } from "@/lib/constants";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: ListTodo }
];

export function Sidebar({ user }: { user: { email: string; role: Role; name: string | null } }) {
  const visibleNav = user.role === ROLES.ADMIN ? nav : nav.filter((item) => item.href !== "/projects");

  return (
    <aside className="m-4 flex w-auto flex-col rounded-2xl border border-white/70 bg-white/80 p-3 shadow-soft backdrop-blur md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-28">
      <div className="mb-3 text-center">
        <Link href="/dashboard" className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 via-fuchsia-300 to-sky-300 text-sm font-black text-white shadow-sm animate-soft-pulse">
          TM
        </Link>
        <p className="mt-2 rounded-full bg-lavender px-2 py-1 text-[10px] font-bold text-brand">{user.role}</p>
      </div>

      <nav className="grid grid-cols-2 gap-3 md:grid-cols-1">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-16 flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-white to-lavender/70 px-2 text-center text-[11px] font-bold text-gray-700 shadow-sm transition hover:-translate-y-1 hover:from-blush hover:to-skysoft hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-brand transition group-hover:scale-110" />
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-line pt-3 md:mt-auto">
        <p className="mb-2 truncate text-center text-[11px] font-semibold text-gray-600">{user.name ?? user.email}</p>
        <SignOutButton />
      </div>
    </aside>
  );
}
