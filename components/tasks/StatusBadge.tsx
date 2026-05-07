import { type Status } from "@/lib/constants";
import { cn } from "@/lib/utils";

const styles: Record<Status, string> = {
  PENDING: "bg-peach text-warning ring-orange-100",
  IN_PROGRESS: "bg-lavender text-brand ring-violet-100",
  COMPLETED: "bg-mint text-success ring-emerald-100"
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ring-1", styles[status])}>
      {status.replace("_", " ")}
    </span>
  );
}
