// src/components/finance/planning-client-manager.tsx

"use client";

import { useState } from "react";
import { PlanningForm } from "./planning-form";
import { PlanningList } from "./planning-list";

export function PlanningClientManager({ initialData }: { initialData: any[] }) {
  const [editingItem, setEditingItem] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <PlanningForm 
        initialData={editingItem} 
        onClear={() => setEditingItem(null)} 
      />

      <PlanningList 
        items={initialData} 
        onEdit={(item) => setEditingItem(item)} 
      />
    </div>
  );
}