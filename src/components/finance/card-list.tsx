// src/components/finance/card-list.tsx

"use client";

import { deleteCreditCard } from "@/lib/actions/cards";
import { toast } from "sonner";

export function CardList({ initialCards }: { initialCards: any[] }) {
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💳</span>
              <p className="font-bold text-zinc-800 text-sm">{c.name}</p>
            </div>
            <div className="flex gap-3">
              <p className="text-[10px] text-zinc-500 uppercase font-black">
                📦 Fecha dia <span className="text-zinc-800">{c.closingDay}</span>
              </p>
              <p className="text-[10px] text-zinc-500 uppercase font-black">
                📅 Vence dia <span className="text-zinc-800">{c.dueDay}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={async () => {
              if(confirm("Deseja excluir?")) {
                const res = await deleteCreditCard(c.id);
                if(res.success) toast.success(res.success);
              }
            }} 
            className="text-[10px] text-red-400 font-black uppercase"
          >
            Excluir
          </button>
        </div>
      ))}
    </section>
  );
}