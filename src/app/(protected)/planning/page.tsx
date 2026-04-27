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

  const planningItems = await prisma.planning.findMany({
    where: { userId: session.user.id },
    orderBy: { category: "asc" },
  });

  const totalAllocated = planningItems.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <HeaderFinance title="Planeamento Financeiro" />

      <PageHeaderCard 
        label="Total Planeado" 
        value={`${totalAllocated}%`}
      >
        <p className="text-[10px] text-zinc-500 italic">
          * O ideal é que a soma das metas atinja 100% do seu rendimento.
        </p>
      </PageHeaderCard>

      <PlanningClientManager initialData={planningItems} />
    </div>
  );
}