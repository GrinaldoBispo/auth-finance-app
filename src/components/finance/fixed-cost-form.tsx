// src/components/finance/fixed-cost-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FixedCostSchema, type FixedCostFormValues } from "@/lib/validations/finance";
import { upsertFixedCost } from "@/lib/actions/fixed-costs";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FixedCostFormProps {
  initialData?: (FixedCostFormValues & { id: string }) | null;
  onClear?: () => void;
}

export function FixedCostForm({ initialData, onClear }: FixedCostFormProps) {
  // CORREÇÃO: Removemos o <FixedCostFormValues> para permitir que o Zod 
  // resolva a inferência de unknown vs number automaticamente no build.
  const form = useForm({
    resolver: zodResolver(FixedCostSchema),
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount ?? 0,
      dueDate: initialData?.dueDate ?? 1,
    },
  });

  async function onSubmit(data: any) {
    // Cast para a Action receber o tipo correto
    const values = data as FixedCostFormValues;
    const res = await upsertFixedCost(values, initialData?.id);
    
    if (res.success) {
      toast.success(res.success);
      form.reset({ description: "", amount: 0, dueDate: 1 });
      if (onClear) onClear();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
          {initialData ? "📝 Editar Gasto Fixo" : "📌 Novo Gasto Fixo"}
        </p>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Input {...field} placeholder="Ex: Aluguel, Internet..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field: { value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  {/* CORREÇÃO: Cast explícito para number para satisfazer o build */}
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...fieldProps} 
                    value={value as number} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field: { value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Dia Vencimento</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...fieldProps} 
                    value={value as number} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] tracking-widest">
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
          {initialData && (
            <Button type="button" variant="outline" onClick={onClear} className="text-[10px] font-bold uppercase tracking-widest">
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}