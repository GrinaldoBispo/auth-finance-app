// src/components/finance/planning-list.tsx

"use client";

import { Planning } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { deletePlanning } from "@/lib/actions/planning";
import { toast } from "sonner";

export function PlanningList({ items, onEdit }: { items: Planning[], onEdit: (i: Planning) => void }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-tighter mb-4 ml-1">
        Metas Cadastradas
      </h3>
      
      {items.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-2xl flex flex-col shadow-sm border border-zinc-100 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <p className="font-bold text-zinc-800 text-sm">🎯 {item.description}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">
                {item.category} | {item.percentage}% do Orçamento
              </p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => onEdit(item)} className="text-[10px] text-blue-500 font-black uppercase">
                Editar
              </button>
              <button 
                onClick={async () => {
                  if(confirm("Excluir meta?")) {
                    const res = await deletePlanning(item.id);
                    if(res.success) toast.success(res.success);
                  }
                }} 
                className="text-[10px] text-red-400 font-black uppercase"
              >
                Excluir
              </button>
            </div>
          </div>
          {/* Barra de progresso integrada na base do card igual à anterior, mas no layout de cartões */}
          <div className="-mx-4 -mb-4">
             <Progress value={item.percentage} className="h-1.5 w-full rounded-none bg-zinc-50" />
          </div>
        </div>
      ))}
    </section>
  );
}