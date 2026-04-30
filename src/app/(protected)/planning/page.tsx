import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { PlanningClientManager } from "@/components/finance/planning-client-manager";

export default async function PlanningPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Buscamos os planos com os dados do grupo (cor e nome)
  const planningData = await prisma.planning.findMany({
    where: { userId: session.user.id },
    include: { financialGroup: true },
    orderBy: { createdAt: "asc" },
  });

  // Buscamos os grupos globais para o Select do formulário
  const financialGroups = await prisma.financialGroup.findMany({
    orderBy: { name: "asc" },
  });

  const totalPercentage = planningData.reduce((acc, item) => acc + item.percentage, 0);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Planejamento Financeiro" />
      
      <PlanningClientManager 
        initialData={planningData} 
        groups={financialGroups} 
      />
    </div>
  );
}