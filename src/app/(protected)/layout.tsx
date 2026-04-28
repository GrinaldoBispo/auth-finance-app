// src/app/(protected)/layout.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { MobileNav } from "@/components/admin/mobile-nav";

export default async function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  return (
    <div className="relative flex h-screen overflow-hidden bg-zinc-50">
      {/* Sidebar: escondida no mobile (hidden), visível no desktop (md:flex) */}
      <div className="hidden md:flex h-full">
        <Sidebar role={role} />
      </div>
      
      {/* Área Principal: removemos o padding-left fixo para ser dinâmico */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* MobileNav: visível apenas no mobile (md:hidden) */}
      <MobileNav role={role} />
    </div>
  );
}