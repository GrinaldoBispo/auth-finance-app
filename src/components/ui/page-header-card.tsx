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
    <div className="relative overflow-hidden bg-zinc-950 rounded-3xl p-6 shadow-2xl border border-zinc-800 mb-8 min-h-[160px] flex flex-col justify-center">
      {/* Detalhe de brilho no fundo */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600/20 blur-3xl rounded-full" />
      
      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] mb-1 relative z-10">
        {label}
      </p>
      
      <h2 className="text-4xl font-black text-white tracking-tighter relative z-10">
        {value}
      </h2>
      
      {children && (
        <div className="mt-6 pt-5 border-t border-zinc-800/50 flex justify-between items-center relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}