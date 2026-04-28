// src/app/(protected)/transactions/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Gastos" />

      <PageHeaderCard label="Total Gastos (Mês)" value="R$ 0,00">
        <p className="text-[10px] text-zinc-500 italic">
          * Resumo de todas as despesas variáveis.
        </p>
      </PageHeaderCard>

      {/* <TransactionsClientManager initialData={[]} /> */}
    </div>
  );
}