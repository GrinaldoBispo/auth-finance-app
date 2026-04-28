// src/app/(protected)/admin/email/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { EmailConfigForm } from "@/components/admin/email-config-form";

export default async function EmailConfigPage() {
  const session = await auth();

  // Bloqueio de segurança
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // BUSCA OS DADOS NO BANCO:
  const initialData = await prisma.systemSettings.findUnique({
    where: { id: "system_config" },
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* 1. Header com botão de voltar para o Painel Admin */}
      <HeaderFinance title="Configuração de E-mail"/>

      {/* 2. Resumo Visual do Serviço */}
      <PageHeaderCard 
        label="Serviço de Mensageria" 
        value={initialData?.smtpHost ? "Configurado" : "Pendente"}
      >
        <div className="flex justify-between w-full items-center">
          <p className="text-[10px] text-zinc-500 italic">
            {initialData?.smtpHost || "Nenhum servidor SMTP detectado"}
          </p>
          {initialData?.smtpHost && (
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>
      </PageHeaderCard>

      {/* 3. O Formulário (Usando o novo estilo de casca branca rounded-xl) */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200">
        <div className="mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Credenciais SMTP
          </h3>
          <p className="text-[11px] text-zinc-500">
            Estas informações permitem que o sistema envie notificações e recuperações de senha.
          </p>
        </div>
        
        <EmailConfigForm initialData={initialData} />
      </div>
    </div>
  );
}