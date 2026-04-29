// src/components/finance/fixed-client-manager.tsx

"use client";

import { useState } from "react";
import { FixedCostForm } from "./fixed-cost-form";
import { FixedCostList } from "./fixed-cost-list";

export function FixedClientManager({ initialData }: { initialData: any[] }) {
  const [editingItem, setEditingItem] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <FixedCostForm 
        initialData={editingItem} 
        onClear={() => setEditingItem(null)} 
      />

      {/* Lista separada conforme o modelo de cartões */}
      <FixedCostList 
        items={initialData} 
        onEdit={(item) => setEditingItem(item)} 
      />
    </div>
  );
}