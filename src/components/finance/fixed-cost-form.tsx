// src/components/finance/fixed-cost-form.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FixedCostSchema, type FixedCostFormValues } from "@/lib/validations/finance";
import { upsertFixedCost } from "@/lib/actions/fixed-costs";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FixedCostForm({ initialData, plannings, onClear }: any) {
  const form = useForm<any>({
    resolver: zodResolver(FixedCostSchema),
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount ?? 0,
      dueDate: initialData?.dueDate ?? 1,
      planningId: initialData?.planningId || "", // Campo atualizado
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData.description,
        amount: initialData.amount,
        dueDate: initialData.dueDate,
        planningId: initialData.planningId,
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: any) {
    const res = await upsertFixedCost(data, initialData?.id);
    if (res.success) {
      toast.success(res.success);
      form.reset({ description: "", amount: 0, dueDate: 1, planningId: "" });
      if (onClear) onClear();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold text-zinc-700 border-b pb-2">
          {initialData ? "Editar Gasto Fixo" : "Novo Gasto Fixo"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input {...field} placeholder="Ex: Aluguel..." /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="planningId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta do Plano</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Selecione a meta" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plannings?.map((plan: any) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.description} ({plan.percentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia Vencimento</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className={`flex-1 font-bold ${initialData ? "bg-amber-600" : ""}`}>
            {initialData ? "ATUALIZAR GASTO" : "SALVAR GASTO"}
          </Button>
          {initialData && <Button type="button" variant="outline" onClick={onClear}>Cancelar</Button>}
        </div>
      </form>
    </Form>
  );
}