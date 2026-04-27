// src/components/finance/cards-client-manager.tsx

"use client";

import { useState } from "react";
import { CardForm } from "./card-form";
import { CardList } from "./card-list";
import { CardFormValues } from "@/lib/validations/finance";

interface Card extends CardFormValues {
  id: string;
}

export function CardsClientManager({ initialCards }: { initialCards: Card[] }) {
  // Estado que armazena qual cartão está sendo editado no momento
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  return (
    <div className="space-y-6">
      <CardForm 
        initialData={editingCard} 
        onClear={() => setEditingCard(null)} 
      />
      
      <CardList 
        initialCards={initialCards} 
        onEdit={(card) => {
          setEditingCard(card);
          // Opcional: scroll suave para o topo onde está o form
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}