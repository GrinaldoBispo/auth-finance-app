import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { startOfMonth, endOfMonth, addMonths } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = session.user.id;
  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { fixedCosts: true },
  });

  if (!user || user.monthlyIncome === 0) {
    redirect("/onboarding");
  }

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // MOTOR DE CÁLCULO: Centralizado para evitar repetição
  const getTotalsForMonth = async (date: Date) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth(date),
          lte: endOfMonth(date),
        },
      },
    });

    // Filtros por categoria
    const extraIncomes = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + t.amount, 0);

    const cashExpenses = transactions
      .filter((t) => t.type === "EXPENSE" && t.paymentMethod === "CASH")
      .reduce((acc, t) => acc + t.amount, 0);

    const creditCardOneShot = transactions
      .filter((t) => t.type === "EXPENSE" && t.paymentMethod === "CREDIT_CARD" && (t.installments || 1) === 1)
      .reduce((acc, t) => acc + t.amount, 0);

    const installmentExpenses = transactions
      .filter((t) => t.type === "EXPENSE" && t.paymentMethod === "CREDIT_CARD" && (t.installments || 1) > 1)
      .reduce((acc, t) => acc + t.amount, 0);

    const fixed = user.fixedCosts.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalIncomes: user.monthlyIncome + extraIncomes,
      totalExpenses: cashExpenses + creditCardOneShot + installmentExpenses + fixed,
      cashExpenses,
      creditCardOneShot,
      installmentExpenses,
      fixed,
      extraIncomes
    };
  };

  // 1. Cálculos do Mês Atual
  const current = await getTotalsForMonth(now);
  const remainingBalance = current.totalIncomes - current.totalExpenses;

  // 2. Cálculos para Projeções (Próximos 3 meses) - Resolvendo o ReferenceError
  const projections = await Promise.all([
    getTotalsForMonth(addMonths(now, 1)),
    getTotalsForMonth(addMonths(now, 2)),
    getTotalsForMonth(addMonths(now, 3)),
  ]);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Dashboard Financeiro" />

      {/* Card Principal */}
      <PageHeaderCard 
        label="Saldo Disponível (Mês Atual)" 
        value={formatBRL(remainingBalance)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 font-black uppercase">Receita Total</span>
            <span className="text-xs font-bold text-emerald-500">
              {formatBRL(current.totalIncomes)}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-zinc-500 font-black uppercase">Gastos Totais</span>
            <span className="text-xs font-bold text-red-500">
              - {formatBRL(current.totalExpenses)}
            </span>
          </div>
        </div>
      </PageHeaderCard>

      {/* Grid de Resumo Detalhado (Solicitado por você) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
             <p className="text-zinc-400 text-[9px] font-black uppercase mb-1">Pix / Débito / Dinheiro</p>
             <h4 className="text-base font-bold text-zinc-700">{formatBRL(current.cashExpenses)}</h4>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
             <p className="text-zinc-400 text-[9px] font-black uppercase mb-1">Cartão (À Vista)</p>
             <h4 className="text-base font-bold text-zinc-700">{formatBRL(current.creditCardOneShot)}</h4>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
             <p className="text-zinc-400 text-[9px] font-black uppercase mb-1">Parcelas do Mês</p>
             <h4 className="text-base font-bold text-zinc-700">{formatBRL(current.installmentExpenses)}</h4>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
             <p className="text-zinc-400 text-[9px] font-black uppercase mb-1">Custos Fixos</p>
             <h4 className="text-base font-bold text-zinc-700">{formatBRL(current.fixed)}</h4>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
             <p className="text-zinc-400 text-[9px] font-black uppercase mb-1">Ganhos Extras</p>
             <h4 className="text-base font-bold text-emerald-600">{formatBRL(current.extraIncomes)}</h4>
          </div>
      </div>

      {/* Projeção de Meses Seguintes */}
      <div className="space-y-4 pt-4">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Planejamento Próximos Meses</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projections.map((proj, index) => {
            const futureDate = addMonths(now, index + 1);
            const futureBalance = proj.totalIncomes - proj.totalExpenses;

            return (
              <div key={index} className="bg-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-colors" />
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">
                  {futureDate.toLocaleString('pt-BR', { month: 'long' })}
                </p>
                <h4 className="text-xl font-bold text-white tracking-tighter">
                  {formatBRL(futureBalance)}
                </h4>
                <div className="mt-3 flex justify-between items-center border-t border-zinc-800/50 pt-3">
                   <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tight">Saldo Estimado</span>
                   <span className="text-[10px] font-bold text-zinc-500">{futureDate.getFullYear()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}