// src/app/(protected)/card/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CardForm } from "@/components/finance/card-form";
import { CardList } from "@/components/finance/card-list";
import { HeaderFinance } from "@/components/ui/header-finance"; // Seus componentes originais
import { PageHeaderCard } from "@/components/ui/page-header-card";

export default async function CardsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // BUSCA DADOS NO BANCO
  const cards = await prisma.creditCard.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <HeaderFinance title="Meus Cartões" />

      <PageHeaderCard 
        label="Cartões Ativos" 
        value={String(cards.length)}
      >
        <p className="text-[10px] text-zinc-500 italic">
          * Utilizados para organizar faturas na projeção futura.
        </p>
      </PageHeaderCard>

      <CardForm />
      <CardList initialCards={cards} />
    </div>
  );
}