// src/app/(protected)/transactions/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { TransactionClientManager } from "@/components/finance/transaction-client-manager";
// import { prisma } from "@/lib/prisma"; // Descomente quando a model Transaction existir

export default async function TransactionsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // --- BUSCA NO BANCO (Mantenha comentado até criar a model no Prisma) ---
  /*
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });
  */
  
  // Por enquanto, usamos um array vazio para não quebrar a página
  const transactions: any[] = []; 

  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);

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

      {/* Gerenciador que criamos no passo anterior */}
      <TransactionClientManager initialData={transactions} />
    </div>
  );
}