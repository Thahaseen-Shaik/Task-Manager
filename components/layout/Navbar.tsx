import { type Role } from "@/lib/constants";

export function Navbar({ user }: { user: { email: string; name: string | null; role: Role } }) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r from-lavender via-blush to-skysoft p-5 shadow-soft md:flex-row md:items-center animate-float-up">
      <div>
        <p className="text-sm font-semibold text-gray-600">Welcome back</p>
        <h1 className="text-2xl font-extrabold text-ink md:text-3xl">{user.name ?? user.email}</h1>
        <p className="mt-1 text-sm text-gray-600">Plan work, assign tasks, and keep the team moving.</p>
      </div>
      <span className="w-fit rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-brand ring-1 ring-white">
        {user.role}
      </span>
    </header>
  );
}
