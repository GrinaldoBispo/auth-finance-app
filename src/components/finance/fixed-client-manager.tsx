// src/components/finance/fixed-client-manager.tsx

"use client";

import { useState } from "react";
import { FixedCostForm } from "./fixed-cost-form";
import { FixedCostList } from "./fixed-cost-list";

export function FixedClientManager({ initialData }: { initialData: any[] }) {
  const [editingItem, setEditingItem] = useState<any | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
      <FixedCostForm 
        initialData={editingItem} 
        onClear={() => setEditingItem(null)} 
      />
      <FixedCostList 
        initialCosts={initialData} 
        onEdit={(item) => {
          setEditingItem(item);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}