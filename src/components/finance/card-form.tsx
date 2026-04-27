// src/components/finance/card-form.tsx

"use client";

import { useState } from "react";
import { addCreditCard } from "@/lib/actions/cards"; // Criaremos esta action
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Ou seu sistema de avisos

export function CardForm() {
  const [name, setName] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    if (!name || !closingDay || !dueDay) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsPending(true);
    const result = await addCreditCard({
      name,
      closingDay: Number(closingDay),
      dueDay: Number(dueDay),
    });

    if (result.success) {
      toast.success(result.success);
      setName(""); setClosingDay(""); setDueDay("");
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  };

  return (
    <Card className="p-4 mb-6 border-zinc-200">
      <p className="text-xs font-bold text-zinc-400 uppercase mb-3 text-center md:text-left">
        💳 Novo Cartão de Crédito
      </p>
      <div className="space-y-3">
        <Input 
          placeholder="Nome (ex: Nubank, Inter...)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Fechamento</label>
            <Input type="number" placeholder="Ex: 05" value={closingDay} onChange={(e) => setClosingDay(e.target.value)} />
          </div>
          <div>
            <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">Vencimento</label>
            <Input type="number" placeholder="Ex: 12" value={dueDay} onChange={(e) => setDueDay(e.target.value)} />
          </div>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Salvando..." : "Adicionar Cartão"}
        </Button>
      </div>
    </Card>
  );
}