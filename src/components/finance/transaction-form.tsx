// src/components/finance/transaction-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema, type TransactionFormValues } from "@/lib/validations/finance";
import { upsertTransaction } from "@/lib/actions/transactions"; // Precisaremos criar esta action
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

export function TransactionForm({ initialData, onClear }: { initialData?: any; onClear?: () => void }) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionSchema) as any,
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().split('T')[0],
      category: initialData?.category || "others",
      type: "EXPENSE",
    },
  });

  async function onSubmit(data: TransactionFormValues) {
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
        <div className="pb-2 border-b">
          <h3 className="text-sm font-bold text-zinc-700">
            {initialData ? "Editar Lançamento" : "Novo Gasto / Ganhos"}
          </h3>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Mercado, Posto, Freelance..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
					value={(field.value as any) ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormControl>
                  <Input 
					type="date"
					{...field}
					value={
						field.value instanceof Date 
						? field.value.toISOString().split("T")[0] 
						: (field.value as string) ?? ""
						}
					/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 font-bold">
            {initialData ? "ATUALIZAR" : "LANÇAR AGORA"}
          </Button>
        </div>
      </form>
    </Form>
  );
}