import { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  const themes: Record<string, string> = {
    Projects: "from-violet-100 via-white to-fuchsia-50",
    Tasks: "from-sky-100 via-white to-violet-50",
    Pending: "from-orange-100 via-white to-amber-50",
    "In progress": "from-blue-100 via-white to-sky-50",
    Completed: "from-emerald-100 via-white to-mint"
  };

  return (
    <div className={`group rounded-3xl border border-white/80 bg-gradient-to-br ${themes[label] ?? "from-white to-lavender"} p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-soft animate-float-up`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-gray-600">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-brand shadow-sm transition group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-4xl font-black text-ink">{value}</p>
    </div>
  );
}
