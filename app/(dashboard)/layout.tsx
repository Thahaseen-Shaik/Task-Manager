import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { syncCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await syncCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-mist md:flex md:gap-2">
      <Sidebar user={user} />
      <main className="w-full p-4 md:p-6 lg:p-8">
        <Navbar user={user} />
        {children}
      </main>
    </div>
  );
}
