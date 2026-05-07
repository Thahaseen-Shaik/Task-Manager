import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-brand text-white shadow-sm hover:bg-violet-500",
        variant === "secondary" && "border border-line bg-white/80 text-ink hover:bg-lavender",
        variant === "danger" && "bg-danger text-white hover:bg-rose-500",
        variant === "ghost" && "text-ink hover:bg-lavender",
        className
      )}
      {...props}
    />
  );
}
