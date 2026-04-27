// src/app/(protected)/settings/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/auth/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();
  
  // Proteção redundante (o layout já faz, mas é bom garantir)
  if (!session) redirect("/login");

  return (
    <div className="max-w-4xl space-y-8">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Configurações da Conta</h1>
        <p className="text-muted-foreground">
          Gerencie as suas informações de perfil, segurança e preferências de conta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Usamos apenas um Card centralizado agora, pois a Sidebar já ocupa a esquerda */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="bg-zinc-50/50 border-b">
            <CardTitle className="text-xl">Perfil & Segurança</CardTitle>
            <CardDescription>
              Mantenha os seus dados atualizados para garantir a segurança da sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Mantemos o seu componente original que tem a lógica de salvar */}
            <SettingsForm user={session.user} />
          </CardContent>
        </Card>

        {/* Placeholder para futuras funcionalidades que você tinha no menu antigo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="bg-zinc-50 border-dashed border-zinc-300">
             <CardContent className="flex items-center justify-center py-6">
               <span className="text-sm text-zinc-400 font-medium italic">Privacidade (Em breve)</span>
             </CardContent>
           </Card>
           <Card className="bg-zinc-50 border-dashed border-zinc-300">
             <CardContent className="flex items-center justify-center py-6">
               <span className="text-sm text-zinc-400 font-medium italic">Pagamentos (Em breve)</span>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}