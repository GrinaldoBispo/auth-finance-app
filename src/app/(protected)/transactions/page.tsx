// src/app/(protected)/transactions/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { TransactionClientManager } from "@/components/finance/transaction-client-manager";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;
  const now = new Date();

  // 1. Buscamos transações do mês, metas e cartões
  const [transactions, plannings, creditCards] = await Promise.all([
    prisma.transaction.findMany({
      where: { 
        userId,
        date: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        }
      },
      include: { 
        planning: { include: { financialGroup: true } },
        creditCard: true 
      },
      orderBy: { date: "desc" },
    }),
    prisma.planning.findMany({ where: { userId } }),
    prisma.creditCard.findMany({ where: { userId } })
  ]);

  // 2. Cálculos para o Header
  const totalExpenses = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncomes = transactions
    .filter(t => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncomes - totalExpenses;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Gastos e Lançamentos" />

      {/* Page Header Card com a lógica Ganhos - Despesas */}
      <PageHeaderCard 
  label="Saldo de Lançamentos (Mês)" 
  value={formatCurrency(balance)}
>
  {/* Removemos a borda daqui se ela já existir no componente pai, 
      ou apenas reforçamos a cor dela para zinc-800 ou zinc-700 */}
  <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col">
      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">
        Ganhos Extras (+)
      </span>
      <span className="text-xs font-bold text-emerald-500">
        {formatCurrency(totalIncomes)}
      </span>
    </div>
    <div className="flex flex-col text-right">
      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">
        Despesas (-)
      </span>
      <span className="text-xs font-bold text-red-500">
        {formatCurrency(totalExpenses)}
      </span>
    </div>
  </div>
</PageHeaderCard>

      <TransactionClientManager 
        initialData={transactions} 
        plannings={plannings}
        creditCards={creditCards}
      />
    </div>
  );
}