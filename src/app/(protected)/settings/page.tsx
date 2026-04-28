// src/app/(protected)/settings/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Meu Perfil" />

      <PageHeaderCard label="Usuário Logado" value={session.user?.name || "Usuário"}>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
          {session.user?.email}
        </p>
      </PageHeaderCard>

      {/* Aqui virão as opções de trocar senha, logout, etc. */}
    </div>
  );
}