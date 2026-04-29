// src/app/(protected)/onboarding/page.tsx

import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { OnboardingForm } from "@/components/finance/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <HeaderFinance title="Configuração Inicial" />

      <PageHeaderCard 
        label="Bem-vindo ao FinanceApp" 
        value="Primeiros Passos"
      >
        <p className="text-[10px] text-zinc-500 italic">
          * Configure sua base financeira para ativar o sistema.
        </p>
      </PageHeaderCard>

      <OnboardingForm />

      <div className="text-center">
        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">
          Segurança total • Dados Criptografados
        </p>
      </div>
    </div>
  );
}