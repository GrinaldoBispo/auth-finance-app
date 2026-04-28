// src/app/(protected)/onboarding/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setupUserAction } from "@/lib/actions/setup-user"; // Ajustado para o seu caminho
import { Loader2 } from "lucide-react"; // Ícone de loading

export default function OnboardingPage() {
  const router = useRouter();
  const [income, setIncome] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    // Validação básica
    const incomeValue = Number(income);
    
    if (!income || incomeValue <= 0) {
      alert("Por favor, insira uma renda mensal válida para gerar seu plano.");
      return;
    }

    setLoading(true);
    try {
      const result = await setupUserAction({
        income: incomeValue,
        balance: Number(balance) || 0,
      });

      if (result.success) {
        // Redireciona para o dashboard já com os dados salvos e plano criado
        router.push("/dashboard");
        router.refresh(); // Garante que o layout perceba a mudança na renda
      }
    } catch (error) {
      console.error("Erro ao configurar onboarding:", error);
      alert("Ocorreu um erro ao salvar suas configurações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header limpo sem botão de voltar, já que é uma etapa obrigatória */}
      <HeaderFinance title="Bem-vindo ao FinanceApp" />

      <PageHeaderCard 
        label="Configuração Inicial" 
        value="Defina sua Renda"
      >
        <p className="text-[10px] text-zinc-500 italic">
          * Criaremos um plano 50/30/20 automaticamente com base no seu ganho mensal.
        </p>
      </PageHeaderCard>

      <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-5 shadow-sm">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            Quanto você ganha por mês?
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">R$</span>
            <Input
              type="number"
              placeholder="0,00"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="h-14 pl-12 text-xl font-black text-zinc-900 border-zinc-200 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            Saldo em conta hoje (Opcional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">R$</span>
            <Input
              type="number"
              placeholder="0,00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="h-12 pl-12 text-zinc-600 border-zinc-100"
            />
          </div>
        </div>

        <Button 
          onClick={handleStart} 
          disabled={loading}
          className="w-full h-14 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              CONFIGURANDO SISTEMA...
            </div>
          ) : (
            "GERAR MEU PLANO AGORA"
          )}
        </Button>
      </div>

      <div className="text-center space-y-1">
        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">
          Segurança total: seus dados são criptografados.
        </p>
        <p className="text-[9px] text-zinc-300">
          Você poderá ajustar porcentagens e valores a qualquer momento no menu Metas.
        </p>
      </div>
    </div>
  );
}