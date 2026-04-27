// src/app/(protected)/dashboard/page.tsx

import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {session?.user?.name}!</h1>
        <p className="text-muted-foreground italic">@{session?.user?.username}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-lg">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-zinc-500">Nome:</span>
              <span className="text-sm font-medium">{session?.user?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-zinc-500">E-mail:</span>
              <span className="text-sm font-medium">{session?.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500">Nível de Acesso:</span>
              <span className="text-sm font-bold text-blue-600">{session?.user?.role}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800">Status do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-700 text-sm">
              Sua conta está ativa e segura. Explore o sistema usando o menu lateral.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}