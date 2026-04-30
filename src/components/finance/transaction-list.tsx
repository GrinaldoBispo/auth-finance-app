// src/components/finance/transaction-list.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ReceiptText, CreditCard as CardIcon } from "lucide-react";
import { deleteTransaction } from "@/lib/actions/transactions";
import { toast } from "sonner";

export function TransactionList({ items, onEdit }: { items: any[]; onEdit: (item: any) => void }) {
  async function handleDelete(id: string) {
    if (confirm("Excluir lançamento?")) {
      const res = await deleteTransaction(id);
      if (res.success) toast.success(res.success);
      else toast.error(res.error);
    }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-zinc-50/50">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Histórico de Lançamentos</h3>
      </div>

      <div className="divide-y divide-zinc-100">
        {items.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-sm italic">Nenhum gasto lançado.</div>
        ) : (
          items.map((item) => {
            const groupColor = item.planning?.financialGroup?.color || "#71717a";
            const isCredit = item.paymentMethod === "CREDIT_CARD";

            return (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-zinc-100 p-2 rounded-lg text-zinc-400">
                    {isCredit ? <CardIcon size={16} /> : <ReceiptText size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">{item.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter">
                      <span className="text-zinc-400 font-medium">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span style={{ color: groupColor }}>• {item.planning?.description}</span>
                      {isCredit && (
                        <span className="text-amber-600 bg-amber-50 px-1.5 rounded">
                          {item.creditCard?.name} {item.installments > 1 ? `(${item.installments}x)` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-black ${item.type === 'INCOME' ? 'text-emerald-600' : 'text-zinc-900'}`}>
                    {item.type === 'EXPENSE' ? '- ' : '+ '}
                    {formatCurrency(item.amount)}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300" onClick={() => onEdit(item)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-red-600" onClick={() => handleDelete(item.id)}>
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