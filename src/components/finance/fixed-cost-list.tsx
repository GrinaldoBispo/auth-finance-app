// src/components/finance/fixed-cost-list.tsx

"use client";

import { deleteFixedCost } from "@/lib/actions/fixed-costs";
import { toast } from "sonner";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FixedCostListProps {
  initialCosts: any[];
  onEdit: (item: any) => void;
}

export function FixedCostList({ initialCosts, onEdit }: FixedCostListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Remover este gasto fixo?")) return;
    const res = await deleteFixedCost(id);
    if (res.success) toast.success(res.success);
    else toast.error(res.error);
  };

  if (initialCosts.length === 0) {
    return <p className="text-center text-zinc-400 text-xs py-10">Nenhum gasto fixo cadastrado.</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-1">
        Gastos Cadastrados
      </h3>
      {initialCosts.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-zinc-100 group">
          <div>
            <p className="font-bold text-zinc-800 text-sm">{item.description}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">
              Vence dia {item.dueDate} • <span className="text-emerald-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
              </span>
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8 text-blue-500">
              <Edit2 size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-400">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}