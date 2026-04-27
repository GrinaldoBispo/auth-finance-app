// src/components/finance/fixed-cost-list.tsx

"use client";

import { deleteFixedCost } from "@/lib/actions/fixed-costs";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function FixedCostList({ initialCosts }: { initialCosts: any[] }) {
  const handleDelete = async (id: string) => {
    if (!confirm("Remover este gasto fixo?")) return;
    const res = await deleteFixedCost(id);
    if (res.success) toast.success(res.success);
  };

  return (
    <div className="space-y-3">
      {initialCosts.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800">{item.description}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">
              Vence dia {item.dueDate} • <span className="text-emerald-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
              </span>
            </p>
          </div>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}