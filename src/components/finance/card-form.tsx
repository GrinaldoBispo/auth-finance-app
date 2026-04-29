// src/components/finance/card-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardSchema, type CardFormValues } from "@/lib/validations/finance";
import { upsertCreditCard } from "@/lib/actions/cards";
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

interface CardFormProps {
  initialData?: any;
  onClear?: () => void;
}

export function CardForm({ initialData, onClear }: CardFormProps) {
  const form = useForm({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      name: initialData?.name || "",
      closingDay: initialData?.closingDay ?? 1,
      dueDay: initialData?.dueDay ?? 1,
    },
  });

  async function onSubmit(data: CardFormValues) {
    const res = await upsertCreditCard(data, initialData?.id);
    
    if (res.success) {
      toast.success(res.success);
      form.reset({ name: "", closingDay: 1, dueDay: 1 });
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
            {initialData ? "Editar Cartão" : "Novo Cartão de Crédito"}
          </h3>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cartão</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Visa Infinite, NuBank..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="closingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia Fechamento</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia Vencimento</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 font-bold">
            {initialData ? "ATUALIZAR CARTÃO" : "SALVAR CARTÃO"}
          </Button>
          {initialData && (
            <Button type="button" variant="outline" onClick={onClear}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}