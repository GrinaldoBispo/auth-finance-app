"use client";

import { Planning } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2 } from "lucide-react";
import { deletePlanning } from "@/lib/actions/planning";
import { toast } from "sonner";

interface PlanningListProps {
  items: Planning[];
  onEdit: (item: Planning) => void;
}

export function PlanningList({ items, onEdit }: PlanningListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta meta?")) return;
    const result = await deletePlanning(id);
    if (result.success) toast.success(result.success);
    else toast.error(result.error);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "ESSENTIAL": return "Essencial";
      case "LIFESTYLE": return "Estilo de Vida";
      case "INVESTMENT": return "Investimentos";
      default: return cat;
    }
  };

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            {/* Header do Item */}
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-zinc-800 text-sm tracking-tight">
                  {item.description}
                </h3>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                  {getCategoryLabel(item.category)}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm font-black text-blue-600 block">
                    {item.percentage}%
                  </span>
                </div>
                <div className="flex gap-1 border-l pl-3 border-zinc-100">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Barra de Progresso - Ocupando a base total do card */}
            <div className="w-full bg-zinc-100">
              <Progress 
                value={item.percentage} 
                className="h-1.5 w-full rounded-none bg-transparent" 
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-2xl border-zinc-100">
          <p className="text-zinc-400 text-xs font-medium">Nenhuma meta cadastrada ainda.</p>
        </div>
      )}
    </div>
  );
}