import { type Priority } from "@/lib/constants";
import { cn } from "@/lib/utils";

const styles: Record<Priority, string> = {
  LOW: "bg-skysoft text-sky-700",
  MEDIUM: "bg-lavender text-brand",
  HIGH: "bg-blush text-danger"
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-extrabold", styles[priority])}>{priority}</span>;
}
