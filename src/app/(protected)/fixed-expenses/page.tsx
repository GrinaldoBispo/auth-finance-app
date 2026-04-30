// src/app/(protected)/fixed-expenses/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { FixedClientManager } from "@/components/finance/fixed-client-manager";

export default async function FixedExpensesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Buscamos Custos Fixos e o Planejamento (que agora faz o papel de categorias)
  const [fixedCosts, plannings] = await Promise.all([
    prisma.fixedCost.findMany({
      where: { userId: session.user.id },
      include: { 
        planning: { // Inclui a meta vinculada
          include: { financialGroup: true } 
        } 
      }, 
      orderBy: { dueDate: "asc" },
    }),
    prisma.planning.findMany({
      where: { userId: session.user.id },
      orderBy: { description: "asc" }
    })
  ]);

  const totalFixed = fixedCosts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Custos Fixos" />

      <PageHeaderCard 
        label="Total Mensal Fixo" 
        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFixed)}
      >
        <p className="text-[10px] text-zinc-400 font-medium">
          {fixedCosts.length} despesas fixas cadastradas
        </p>
      </PageHeaderCard>

      {/* Passamos 'plannings' para o Manager */}
      <FixedClientManager initialData={fixedCosts} plannings={plannings} />
    </div>
  );
}