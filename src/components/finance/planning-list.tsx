// src/components/finance/planning-list.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, PieChart } from "lucide-react";
import { deletePlanning } from "@/lib/actions/planning";
import { toast } from "sonner";

// Definimos a interface para o TypeScript não reclamar
interface PlanningItem {
  id: string;
  description: string;
  percentage: number;
  financialGroupId: string;
  financialGroup?: {
    id?: string;    // Adicionado id como opcional
    name: string;
    color: string;
  };
}

interface PlanningListProps {
  items: PlanningItem[];
  onEdit: (item: PlanningItem) => void;
  onDelete: (id: string) => void;
}

export function PlanningList({ items, onEdit, onDelete }: PlanningListProps) {
  
  async function handleDelete(id: string) {
    if (!confirm("Remover meta?")) return;
    
    if (id.startsWith("temp-")) {
      onDelete(id);
      return;
    }

    const res = await deletePlanning(id);
    if (res.success) {
      toast.success(res.success);
      onDelete(id);
    } else {
      toast.error(res.error);
    }
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-zinc-50/50">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Estrutura de Gastos
        </h3>
      </div>

      <div className="divide-y divide-zinc-100">
        {items.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-sm italic">
            Nenhuma meta cadastrada.
          </div>
        ) : (
          items.map((item: PlanningItem) => { // Tipagem adicionada aqui
            const color = item.financialGroup?.color || "#3b82f6";
            const groupName = item.financialGroup?.name || "Essenciais";

            return (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-zinc-100">
                    <PieChart size={18} style={{ color: color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">{item.description}</p>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: color }}>
                      {groupName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="px-3 py-1 rounded-full border bg-white" style={{ borderColor: color + '40' }}>
                    <span className="text-sm font-black" style={{ color: color }}>
                      {item.percentage}%
                    </span>
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}