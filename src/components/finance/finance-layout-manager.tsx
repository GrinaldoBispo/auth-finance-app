// src/components/finance/finance-layout-manager.tsx

"use client";

import { ReactNode } from "react";

interface FinanceLayoutManagerProps {
  title?: string;
  form: ReactNode;
  list: ReactNode;
}

export function FinanceLayoutManager({ title, form, list }: FinanceLayoutManagerProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 pb-10">
      {/* Container do Formulário */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        {form}
      </section>

      {/* Divisor Visual */}
      <div className="h-px bg-zinc-100 w-full" />

      {/* Container da Lista */}
      <section className="space-y-4">
        {title && (
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            {title}
          </h3>
        )}
        <div className="animate-in fade-in duration-700">
          {list}
        </div>
      </section>
    </div>
  );
}