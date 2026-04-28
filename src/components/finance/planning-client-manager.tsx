// src/components/finance/planning-client-manager.tsx

"use client";

import { useState } from "react";
import { PlanningForm } from "./planning-form";
import { PlanningList } from "./planning-list";
import { Planning } from "@prisma/client";

export function PlanningClientManager({ initialData }: { initialData: Planning[] }) {
  const [editingItem, setEditingItem] = useState<Planning | null>(null);

  return (
    <div className="space-y-6">
      <PlanningForm 
        initialData={editingItem} 
        onClear={() => setEditingItem(null)} 
      />
      
      <PlanningList 
        items={initialData} 
        onEdit={(item) => {
          setEditingItem(item);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}