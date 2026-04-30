// src/components/finance/transaction-form.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema } from "@/lib/validations/finance";
import { upsertTransaction } from "@/lib/actions/transactions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export function TransactionForm({ initialData, plannings, creditCards, onClear }: any) {
  const form = useForm({
    resolver: zodResolver(TransactionSchema) as any,
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split('T')[0],
      type: initialData?.type || "EXPENSE",
      paymentMethod: initialData?.paymentMethod || "CASH",
      installments: initialData?.installments || 1,
      creditCardId: initialData?.creditCardId || "",
      planningId: initialData?.planningId || "",
    },
  });

  // Sincroniza o formulário ao entrar em modo de edição ou limpar
  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData.description,
        amount: initialData.amount,
        date: new Date(initialData.date).toISOString().split('T')[0],
        type: initialData.type,
        paymentMethod: initialData.paymentMethod || "CASH",
        installments: initialData.installments || 1,
        creditCardId: initialData.creditCardId || "",
        planningId: initialData.planningId,
      });
    } else {
      form.reset({
        description: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        type: "EXPENSE",
        paymentMethod: "CASH",
        installments: 1,
        creditCardId: "",
        planningId: "",
      });
    }
  }, [initialData, form]);

  const paymentMethod = form.watch("paymentMethod");
  const transactionType = form.watch("type");

  async function onSubmit(data: any) {
    // Log para depuração: Verifique se o planningId aparece aqui no console (F12)
    console.log("Submetendo dados:", data);

    const res = await upsertTransaction(data, initialData?.id);
    
    if (res.success) {
      toast.success(res.success);
      form.reset();
      if (onClear) onClear();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="pb-2 border-b flex justify-between items-center">
          <h3 className="text-sm font-bold text-zinc-700">
            {initialData ? "Editar Lançamento" : "Novo Gasto / Ganho"}
          </h3>
        </div>

        {/* TOGGLE TIPO DE TRANSAÇÃO */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <Tabs onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-10">
                <TabsTrigger value="EXPENSE" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-bold uppercase text-[10px]">Despesa</TabsTrigger>
                <TabsTrigger value="INCOME" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-bold uppercase text-[10px]">Ganho</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input {...field} placeholder="Ex: Mercado, Aluguel..." /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="planningId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vincular à Meta</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma meta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plannings?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.description}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {transactionType === "EXPENSE" && (
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">À Vista / Pix / Débito</SelectItem>
                      <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
        </div>

        {paymentMethod === "CREDIT_CARD" && transactionType === "EXPENSE" && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-lg border border-dashed animate-in fade-in zoom-in duration-200">
            <FormField
              control={form.control}
              name="creditCardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual Cartão?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Escolha o cartão" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {creditCards?.map((card: any) => (
                        <SelectItem key={card.id} value={card.id}>{card.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº de Parcelas</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="flex-1 font-bold h-9 bg-zinc-900 hover:bg-black"
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "ATUALIZAR LANÇAMENTO" : "CONFIRMAR LANÇAMENTO"}
          </Button>
          
          {initialData && (
            <Button type="button" variant="outline" onClick={onClear} className="font-bold">
              CANCELAR
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}