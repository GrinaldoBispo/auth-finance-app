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

  // BUSCA DADOS NO BANCO (Server Side)
  const fixedCosts = await prisma.fixedCost.findMany({
    where: { userId: session.user.id },
    orderBy: { dueDate: "asc" },
  });

  const totalFixed = fixedCosts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Gastos Fixos" />

      <PageHeaderCard 
        label="Total Mensal Fixo" 
        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFixed)}
      >
        <p className="text-[11px] text-zinc-400 italic">
          Custos que se repetem todos os meses
        </p>
      </PageHeaderCard>

      {/* O Manager orquestra o Form e a List internamente gerenciando o estado de edição */}
      <FixedClientManager initialData={fixedCosts} />
    </div>
  );
}