// src/app/(protected)/planning/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { PlanningClientManager } from "@/components/finance/planning-client-manager";

export default async function PlanningPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const planningData = await prisma.planning.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Planejamento Financeiro" />

      <PageHeaderCard label="Planejamento Geral" value="0%">
        <p className="text-[10px] text-zinc-500 italic">
          * Definição de limites por categoria.
        </p>
      </PageHeaderCard>
      
      {/* Aqui o Manager faz a divisão das colunas igual aos cartões */}
      <PlanningClientManager initialData={planningData} />
    </div>
  );
}