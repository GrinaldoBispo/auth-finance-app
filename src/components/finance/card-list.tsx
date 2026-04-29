// src/components/finance/card-list.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CreditCard } from "lucide-react";
import { deleteCreditCard } from "@/lib/actions/cards";
import { toast } from "sonner";

interface CardListProps {
  items: any[];
  onEdit: (item: any) => void;
}

export function CardList({ items, onEdit }: CardListProps) {
  async function handleDelete(id: string) {
    if (confirm("Deseja excluir este cartão?")) {
      const res = await deleteCreditCard(id);
      if (res.success) toast.success(res.success);
      else toast.error(res.error);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-zinc-50/50">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Meus Cartões
        </h3>
      </div>

      <div className="divide-y divide-zinc-100">
        {(items || []).length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-sm italic">
            Nenhum cartão cadastrado.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-800">{item.name}</p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                  <span className="flex items-center gap-1 uppercase">
                    <CreditCard size={12} className="text-zinc-400" />
                    Fecha dia {item.closingDay} • Vence dia {item.dueDay}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-blue-600"
                  onClick={() => onEdit(item)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-600"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}