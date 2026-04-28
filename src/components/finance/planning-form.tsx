// src/components/finance/planning-form.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanningSchema, type PlanningFormValues } from "@/lib/validations/finance";
import { upsertPlanning } from "@/lib/actions/planning";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PlanningForm({ initialData, onClear }: { initialData?: any; onClear?: () => void }) {
  const form = useForm({
    resolver: zodResolver(PlanningSchema),
    defaultValues: {
      description: initialData?.description || "",
      category: initialData?.category || "ESSENTIAL",
      percentage: initialData?.percentage || 0,
    },
  });

  async function onSubmit(data: any) {
    const res = await upsertPlanning(data as PlanningFormValues, initialData?.id);
    if (res.success) {
      toast.success(res.success);
      form.reset({ description: "", category: "ESSENTIAL", percentage: 0 });
      if (onClear) onClear();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border">
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Input {...field} placeholder="Ex: Moradia" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Gasto</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="ESSENTIAL">Essencial</SelectItem>
                  <SelectItem value="LIFESTYLE">Estilo de Vida</SelectItem>
                  <SelectItem value="INVESTMENT">Investimento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="percentage" render={({ field }) => (
            <FormItem>
              <FormLabel>Percentual (%)</FormLabel>
              <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 font-bold">
            {initialData ? "ATUALIZAR META" : "ADICIONAR META"}
          </Button>
          {initialData && (
            <Button type="button" variant="outline" onClick={onClear}>Cancelar</Button>
          )}
        </div>
      </form>
    </Form>
  );
}