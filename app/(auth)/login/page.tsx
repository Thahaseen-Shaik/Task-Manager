import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4 py-8">
      <AuthForm mode="login" />
    </main>
  );
}
