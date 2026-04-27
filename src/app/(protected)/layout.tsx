// src/app/(protected)/layout.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";

export default async function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Passamos a role do usuário para a Sidebar decidir o que mostrar
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar role={session.user?.role} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}