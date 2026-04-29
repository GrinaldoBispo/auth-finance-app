// src/lib/validations/onboarding.ts

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingSchema, type OnboardingValues } from "@/lib/validations/onboarding";
import { setupUserAction } from "@/lib/actions/setup-user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

export function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      income: 0,
      balance: 0,
    },
  });

  async function onSubmit(data: any) {
    const values = data as OnboardingValues;
    setLoading(true);

    try {
      const res = await setupUserAction(values);
      if (res.success) {
        toast.success("Sistema configurado!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Erro ao salvar dados.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      {/* Classe exata do seu CardForm para garantir o layout */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border">
        
        <FormField 
          control={form.control} 
          name="income" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renda Mensal (Salário)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">R$</span>
                  <Input 
                    type="number" 
                    {...field} 
                    className="pl-10" 
                    value={field.value as number}
                    placeholder="0,00"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="balance" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Atual em Conta (Opcional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">R$</span>
                  <Input 
                    type="number" 
                    {...field} 
                    className="pl-10" 
                    value={field.value as number}
                    placeholder="0,00"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 font-bold" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                CONFIGURANDO...
              </div>
            ) : (
              "GERAR MEU PLANO AGORA"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}