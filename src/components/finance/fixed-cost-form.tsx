// src/components/finance/fixed-cost-form.tsx

"use client";

import { useState } from "react";
import { addFixedCost } from "@/lib/actions/fixed-costs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pin } from "lucide-react";

export function FixedCostForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    // Validação básica
    if (!description || !amount || !dueDate) {
      toast.error("Preencha todos os campos do custo fixo.");
      return;
    }

    setIsPending(true);

    const result = await addFixedCost({
      description,
      amount: parseFloat(amount.replace(",", ".")), // Converte string para número
      dueDate: Number(dueDate),
    });

    if (result.success) {
      toast.success(result.success);
      setDescription("");
      setAmount("");
      setDueDate("");
    } else {
      toast.error(result.error || "Ocorreu um erro");
    }

    setIsPending(false);
  };

  return (
    <Card className="p-5 border-zinc-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-zinc-400">
        <Pin size={16} />
        <p className="text-xs font-bold uppercase tracking-wider">
          Novo Gasto Fixo
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Descrição</label>
          <Input 
            placeholder="Ex: Aluguel, Internet, Academia..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Valor (R$)</label>
            <Input 
              type="number"
              step="0.01"
              placeholder="0,00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Dia Vencimento</label>
            <Input 
              type="number" 
              placeholder="Ex: 10" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
            />
          </div>
        </div>

        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-xs tracking-widest pt-1" 
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Salvando..." : "Salvar Gasto Fixo"}
        </Button>
      </div>
    </Card>
  );
}