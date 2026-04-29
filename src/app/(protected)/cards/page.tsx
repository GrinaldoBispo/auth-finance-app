// src/app/(protected)/cards/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation"; 
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
// Importamos um componente Client para gerenciar a interação Adicionar/Editar
import { CardsClientManager } from "@/components/finance/cards-client-manager";

export default async function CardsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const cards = await prisma.creditCard.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Meus Cartões" />

      <PageHeaderCard label="Cartões Ativos" value={String(cards.length)}>
        <p className="text-[10px] text-zinc-500 italic">
          * Utilizados para organizar faturas na projeção futura.
        </p>
      </PageHeaderCard>

      <CardsClientManager initialData={cards} />
    </div>
  );
}