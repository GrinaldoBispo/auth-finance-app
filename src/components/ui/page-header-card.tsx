//src/components/ui/page-header-card.tsx

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderCardProps {
  label: string;
  value: string;
  children?: ReactNode;
}

export function PageHeaderCard({ label, value, children }: PageHeaderCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-800 mb-8",
      "p-5 md:p-8", // Menos padding no mobile
      "min-h-[120px] md:min-h-[160px]", // Mais baixo no mobile
      "flex flex-col justify-center"
    )}>
      {/* Detalhe de brilho no fundo - Diminuído no mobile */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 md:w-24 md:h-24 bg-blue-600/20 blur-3xl rounded-full" />
      
      <p className="text-[9px] md:text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] mb-1 relative z-10">
        {label}
      </p>
      
      {/* Texto 4xl vira 3xl no mobile para não quebrar linha se o valor for grande */}
      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter relative z-10">
        {value}
      </h2>
      
      {children && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-5 border-t border-zinc-800/50 flex justify-between items-center relative z-10">
          <div className="w-full">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}