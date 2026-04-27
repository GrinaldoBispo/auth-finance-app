// src/components/ui/header-finance.tsx

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "./button";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function HeaderFinance({ title, showBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-6">
      {showBack && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="h-8 w-8 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        {title}
      </h1>
    </div>
  );
}