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
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface PlanningFormProps {
  initialData?: any;
  onClear?: () => void;
}

export function PlanningForm({ initialData, onClear }: PlanningFormProps) {
  const form = useForm<PlanningFormValues>({
    resolver: zodResolver(PlanningSchema) as any,
    defaultValues: {
      description: initialData?.description || "",
      category: initialData?.category || "essentials",
      percentage: initialData?.percentage || 0,
    },
  });

  async function onSubmit(data: PlanningFormValues) {
    const res = await upsertPlanning(data, initialData?.id);
    if (res.success) {
      toast.success(res.success);
      form.reset({ description: "", category: "essentials", percentage: 0 });
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
            {initialData ? "Editar Meta" : "Nova Meta de Gasto"}
          </h3>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Reserva, Aluguel..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="essentials">Essenciais</SelectItem>
                    <SelectItem value="lifestyle">Estilo de Vida</SelectItem>
                    <SelectItem value="investments">Investimentos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentual (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
					value={(field.value as any) ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 font-bold">
            {initialData ? "ATUALIZAR META" : "SALVAR META"}
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