// src/components/finance/planning-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanningSchema, type PlanningFormValues } from "@/lib/validations/finance";
import { upsertPlanning } from "@/lib/actions/planning";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlanningFormProps {
  initialData?: any;
  onClear?: () => void;
}

export function PlanningForm({ initialData, onClear }: PlanningFormProps) {
  // CORREÇÃO: Removemos o <PlanningFormValues> para evitar conflito de unknown vs number no build
  const form = useForm({
    resolver: zodResolver(PlanningSchema),
    defaultValues: initialData || {
      description: "",
      category: "ESSENTIAL",
      percentage: 0,
    },
  });

  async function onSubmit(data: any) {
    const values = data as PlanningFormValues;
    const res = await upsertPlanning(values, initialData?.id);
    
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Moradia, Alimentação..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Gasto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ESSENTIAL">Essencial</SelectItem>
                    <SelectItem value="LIFESTYLE">Estilo de Vida</SelectItem>
                    <SelectItem value="INVESTMENT">Investimento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="percentage"
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Percentual do Orçamento (%)</FormLabel>
              <FormControl>
                {/* CORREÇÃO: Cast explícito de value para number resolve o erro de build */}
                <Input 
                  type="number" 
                  {...fieldProps} 
                  value={value as number} 
                  placeholder="Ex: 50" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold uppercase text-[10px] tracking-widest">
            {initialData ? "Atualizar Meta" : "Definir Meta"}
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