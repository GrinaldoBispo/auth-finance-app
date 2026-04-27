// src/components/finance/card-list.tsx

"use client";

import { deleteCreditCard } from "@/lib/actions/cards";
import { toast } from "sonner";

interface CardListProps {
  initialCards: any[];
  onEdit: (card: any) => void; // Prop obrigatória para o Manager funcionar
}

export function CardList({ initialCards, onEdit }: CardListProps) {
  if (initialCards.length === 0) {
    return <p className="text-center text-zinc-400 text-xs py-10">Nenhum cartão cadastrado.</p>;
  }

  return (
    <section className="space-y-3">
      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-tighter mb-4 ml-1">
        Cartões Cadastrados
      </h3>
      
      {initialCards.map((c) => (
        <div key={c.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-zinc-100">
          <div className="flex-1">
            <p className="font-bold text-zinc-800 text-sm">💳 {c.name}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-black">
              Fecha dia {c.closingDay} | Vence dia {c.dueDay}
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => onEdit(c)} 
              className="text-[10px] text-blue-500 font-black uppercase"
            >
              Editar
            </button>
            <button 
              onClick={async () => {
                if(confirm("Excluir cartão?")) {
                  const res = await deleteCreditCard(c.id);
                  if(res.success) toast.success(res.success);
                }
              }} 
              className="text-[10px] text-red-400 font-black uppercase"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}