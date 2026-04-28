// src/app/(protected)/dashboard/page.tsx

// src/app/(protected)/dashboard/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // 1. Buscamos os dados do usuário logado
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      monthlyIncome: true,
      initialBalance: true 
    }
  });

  // 2. Trava de Segurança
  if (!user || user.monthlyIncome === 0) {
    redirect("/onboarding");
  }

  // Formatação de moeda para a Renda Mensal
  const formattedIncome = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(user.monthlyIncome || 0);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Dashboard" />

      {/* Card de Renda Mensal (monthlyIncome) como valor principal */}
      <PageHeaderCard label="Renda Mensal" value={formattedIncome}>
        <p className="text-[10px] text-zinc-500 italic">
          * Base de cálculo para seu planejamento mensal.
        </p>
      </PageHeaderCard>

      {/* Grid para futuros gráficos ou mini-cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center min-h-[150px] border-dashed">
             <p className="text-zinc-400 text-[10px] font-black uppercase">Gráficos em breve</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center min-h-[150px] border-dashed">
             <p className="text-zinc-400 text-[10px] font-black uppercase">Últimos Gastos em breve</p>
          </div>
      </div>
    </div>
  );
}