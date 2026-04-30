// src/components/finance/planning-form.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PlanningForm({ initialData, groups, onSave, onClear }: any) {
  const form = useForm({
    defaultValues: {
      description: "",
      financialGroupId: "",
      percentage: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData.description,
        financialGroupId: initialData.financialGroupId || initialData.financialGroup?.id,
        percentage: initialData.percentage,
      });
    } else {
      form.reset({ description: "", financialGroupId: groups[0]?.id || "", percentage: 0 });
    }
  }, [initialData, groups, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold text-zinc-700 border-b pb-2">
          {initialData ? "Editar Meta" : "Adicionar Meta ao Plano"}
        </h3>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Input {...field} placeholder="Ex: Aluguel, Academia..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="financialGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo Mestre</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groups.map((g: any) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
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
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className={`flex-1 font-bold ${initialData ? "bg-amber-600" : ""}`}>
            {initialData ? "ATUALIZAR ITEM" : "INCLUIR NA LISTA"}
          </Button>
          {initialData && <Button type="button" variant="outline" onClick={onClear}>CANCELAR</Button>}
        </div>
      </form>
    </Form>
  );
}