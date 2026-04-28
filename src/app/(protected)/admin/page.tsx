// src/app/(protected)/admin/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HeaderFinance } from "@/components/ui/header-finance";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { Users, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await auth();
  
  // Segurança: Só ADMIN entra
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Busca dados REAIS do banco
  const userCount = await prisma.user.count();
  const config = await prisma.systemSettings.findUnique({ where: { id: "system_config" } });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* 1. Cabeçalho Padrão */}
      <HeaderFinance title="Painel Administrativo" />

      {/* 2. Card Principal: Foco no Crescimento (Usuários) */}
      <PageHeaderCard label="Total de Usuários Registrados" value={String(userCount)}>
        <p className="text-[10px] text-zinc-500 italic">
          * Base de dados ativa no sistema FinanceApp.
        </p>
      </PageHeaderCard>

      {/* 3. Grid de Ações Rápidas / Status de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card de Configuração de E-mail */}
        <Link 
          href="/admin/email" 
          className="group bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:border-blue-200 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-600 transition-colors">
              <Mail className="h-5 w-5 text-blue-600 group-hover:text-white" />
            </div>
            {config ? (
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Ativo
              </span>
            ) : (
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                Pendente
              </span>
            )}
          </div>
          
          <h3 className="font-bold text-zinc-900 text-sm">Serviço de E-mail</h3>
          <p className="text-xs text-zinc-500 mb-4">
            {config?.smtpHost || "Configure o SMTP para habilitar notificações."}
          </p>
          
          <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase">
            Gerenciar Configurações <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        {/* Placeholder para Futuros Serviços (Logs, Backups, etc) */}
        <div className="bg-zinc-50/50 p-6 rounded-2xl border border-dashed border-zinc-200 flex flex-col justify-center items-center text-center">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Novos Módulos em Breve
          </p>
        </div>

      </div>
    </div>
  );
}