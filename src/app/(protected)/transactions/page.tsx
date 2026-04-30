// src/app/(protected)/transactions/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { TransactionClientManager } from "@/components/finance/transaction-client-manager";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Buscamos as transações com todos os relacionamentos para a lista
  const [transactions, plannings, creditCards] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      include: { 
        planning: { include: { financialGroup: true } },
        creditCard: true 
      },
      orderBy: { date: "desc" },
    }),
    prisma.planning.findMany({ where: { userId: session.user.id } }),
    prisma.creditCard.findMany({ where: { userId: session.user.id } })
  ]);

  const totalSpent = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Gastos e Lançamentos" />

      <PageHeaderCard 
        label="Total Mensal Variável" 
        value={formatCurrency(totalSpent)}
      >
        <p className="text-[10px] text-zinc-400 font-medium">
          {transactions.length} lançamentos registrados este mês
        </p>
      </PageHeaderCard>

      <TransactionClientManager 
        initialData={transactions} 
        plannings={plannings}
        creditCards={creditCards}
      />
    </div>
  );
}