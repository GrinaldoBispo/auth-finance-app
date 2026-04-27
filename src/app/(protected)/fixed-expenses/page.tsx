// src/app/(protected)/fixed-expenses/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { FixedCostForm } from "@/components/finance/fixed-cost-form";
import { FixedCostList } from "@/components/finance/fixed-cost-list";

export default async function FixedExpensesPage() {
  const session = await auth();
  if (!session) redirect("/login");

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

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
        <FixedCostForm />
        <FixedCostList initialCosts={fixedCosts} />
      </div>
    </div>
  );
}