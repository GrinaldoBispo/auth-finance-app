// src/components/finance/fixed-cost-list.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Tag } from "lucide-react";
import { deleteFixedCost } from "@/lib/actions/fixed-costs";
import { toast } from "sonner";

interface FixedCostListProps {
  items: any[];
  onEdit: (item: any) => void;
}

export function FixedCostList({ items, onEdit }: FixedCostListProps) {
  async function handleDelete(id: string) {
    if (confirm("Deseja excluir este custo fixo?")) {
      const res = await deleteFixedCost(id);
      if (res.success) toast.success(res.success);
      else toast.error(res.error);
    }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-zinc-50/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Listagem de Custos Fixos
        </h3>
      </div>

      <div className="divide-y divide-zinc-100">
        {items.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-sm italic">
            Nenhum custo fixo cadastrado para este planejamento.
          </div>
        ) : (
          items.map((item) => {
            // Pegamos a cor do grupo financeiro através da relação Planning -> FinancialGroup
            const groupColor = item.planning?.financialGroup?.color || "#71717a";
            const metaName = item.planning?.description || "Sem Categoria";

            return (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Indicador visual de cor do Grupo Financeiro */}
                  <div 
                    className="w-1.5 h-10 rounded-full" 
                    style={{ backgroundColor: groupColor }}
                  />
                  
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-800">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                        <Calendar size={12} className="text-zinc-400" />
                        Vence dia {item.dueDate}
                      </span>
                      <span 
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tight"
                        style={{ 
                          color: groupColor, 
                          borderColor: `${groupColor}40`,
                          backgroundColor: `${groupColor}10` 
                        }}
                      >
                        <Tag size={10} />
                        {metaName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-zinc-900">
                    {formatCurrency(item.amount)}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}