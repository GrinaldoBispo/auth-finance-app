// src/app/(protected)/settings/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { ProfileForm } from "@/components/finance/profile-form";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  const format = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Somamos para o valor principal do Card
  const totalResources = (user?.monthlyIncome || 0) + (user?.initialBalance || 0);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Configurações" />

      {/* Header seguindo o padrão de uma linha principal */}
      <PageHeaderCard 
        label="Recursos Totais Configurados" 
        value={format(totalResources)}
      >
        <p className="text-[10px] text-zinc-500 italic">
          * Saldo Atual ({format(user?.initialBalance || 0)}) + Renda ({format(user?.monthlyIncome || 0)})
        </p>
      </PageHeaderCard>

      {/* O Formulário com o estilo da imagem (inputs cinzas) */}
      <ProfileForm initialData={{
        name: user?.name || "",
        username: user?.username || "",
        monthlyIncome: user?.monthlyIncome || 0,
        initialBalance: user?.initialBalance || 0,
      }} />
    </div>
  );
}