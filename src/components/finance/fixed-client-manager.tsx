// src/components/finance/fixed-client-manager.tsx

"use client";

import { useState } from "react";
import { FixedCostForm } from "./fixed-cost-form";
import { FixedCostList } from "./fixed-cost-list";

export function FixedClientManager({ 
  initialData, 
  plannings = [] 
}: { 
  initialData: any[], 
  plannings: any[] 
}) {
  const [editingItem, setEditingItem] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <FixedCostForm 
        initialData={editingItem} 
        plannings={plannings} 
        onClear={() => setEditingItem(null)} 
      />

      <FixedCostList 
        items={initialData} 
        onEdit={(item) => setEditingItem(item)} 
      />
    </div>
  );
}