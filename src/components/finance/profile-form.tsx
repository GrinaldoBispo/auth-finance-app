"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "@/lib/validations/user";
import { updateProfile } from "@/lib/actions/update-profile";
import { resetAccount } from "@/lib/actions/reset-account"; // Importe a action de reset
import { signOut } from "next-auth/react"; // Importe o signOut do client
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, LogOut } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

export function ProfileForm({ initialData }: { initialData: any }) {
  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: any) {
    const res = await updateProfile(values);
    if (res.success) {
      toast.success(res.success);
    } else {
      toast.error(res.error);
    }
  }

  const onError = (errors: any) => {
    console.log("Erros de validação do Zod:", errors);
  };

	  async function handleReset() {
	  if (confirm("Deseja zerar sua Renda e Saldo agora?")) {
		const res = await resetAccount();
		if (res.success) {
		  toast.success(res.success);
		  
		  // Limpa os campos do formulário visualmente
		  form.reset({
			name: form.getValues("name"),
			username: form.getValues("username"),
			monthlyIncome: 0,
			initialBalance: 0,
		  });

		  // Opcional: Redireciona para o onboarding se você quiser que ele reconfigure
		  // window.location.href = "/onboarding"; 
		} else {
		  toast.error(res.error);
		}
	  }
	}

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
          
          <div className="pb-2 border-b">
            <h3 className="text-sm font-bold text-zinc-700">Dados de Acesso</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Exibido</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="username" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de Usuário (@)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl><Input {...field} type="email" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha (deixe vazio para manter)</FormLabel>
                <FormControl><Input {...field} type="password" placeholder="******" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="pb-2 border-b pt-2">
            <h3 className="text-sm font-bold text-zinc-700">Ajuste Financeiro Mensal</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
              <FormItem>
                <FormLabel>Renda Mensal</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="initialBalance" render={({ field }) => (
              <FormItem>
                <FormLabel>Saldo em Conta</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 font-bold">
              SALVAR TODAS AS ALTERAÇÕES
            </Button>
          </div>
        </form>
      </Form>

      {/* CARD 2: ZONA DE PERIGO (RESET) */}
      <div className="space-y-4 bg-white p-6 rounded-xl border border-red-100 shadow-sm">
        <div className="pb-2 border-b border-red-50">
          <h3 className="text-sm font-bold text-red-600">Zona de Perigo</h3>
        </div>
        <p className="text-xs text-zinc-500 italic">
          Ao resetar, todos os seus registros de gastos e configurações financeiras serão removidos permanentemente.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleReset}
          className="w-full font-bold gap-2"
        >
          <Trash2 className="w-4 h-4" />
          LIMPAR TODOS OS DADOS
        </Button>
      </div>

      {/* BOTÃO FORA: LOGOUT */}
      <Button 
        variant="ghost" 
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full text-zinc-500 hover:text-red-600 gap-2 font-bold"
      >
        <LogOut className="w-4 h-4" />
        SAIR DA CONTA
      </Button>
    </div>
  );
}