// src/components/ui/header-finance.tsx

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function HeaderFinance({ title, showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
      {showBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          // Aumentamos a área de toque no mobile sem aumentar o ícone
          className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-zinc-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-zinc-600" />
        </Button>
      )}
      
      <h1 className={cn(
        "font-bold tracking-tight text-zinc-900 leading-none",
        // No mobile: text-xl (mais discreto) 
        // No desktop: text-2xl ou 3xl (mais imponente)
        "text-xl md:text-3xl"
      )}>
        {title}
      </h1>
    </div>
  );
}