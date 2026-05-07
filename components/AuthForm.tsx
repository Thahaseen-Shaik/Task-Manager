"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    const response = await fetch(mode === "signup" ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to continue");
      setLoading(false);
      return;
    }
    
    setMessage(mode === "signup" ? "Account created successfully." : "");
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-line bg-white/85 p-6 shadow-soft backdrop-blur">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-2 text-sm text-gray-600">Sign in to manage your projects and tasks.</p>
      </div>

      {mode === "signup" ? (
        <label className="mb-4 block text-sm font-medium">
          Name
          <input name="name" className="mt-1 w-full rounded-md border-line" placeholder="Ada Lovelace" />
        </label>
      ) : null}

      <label className="mb-4 block text-sm font-medium">
        Email
        <input name="email" type="email" required className="mt-1 w-full rounded-md border-line" placeholder="you@company.com" />
      </label>

      <label className="mb-4 block text-sm font-medium">
        Password
        <input name="password" type="password" required minLength={6} className="mt-1 w-full rounded-md border-line" placeholder="••••••••" />
      </label>

      {message ? <p className="mb-4 rounded-md bg-mint px-3 py-2 text-sm text-success">{message}</p> : null}
      {error ? <p className="mb-4 rounded-md bg-blush px-3 py-2 text-sm text-danger">{error}</p> : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === "login" ? "No account?" : "Already have an account?"}{" "}
        <Link className="font-medium text-brand" href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
