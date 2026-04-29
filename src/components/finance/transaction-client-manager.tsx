// src/components/finance/transaction-client-manager.tsx

"use client";

import { useState } from "react";
import { TransactionForm } from "./transaction-form";
import { TransactionList } from "./transaction-list";

export function TransactionClientManager({ initialData }: { initialData: any[] }) {
  const [editingItem, setEditingItem] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <TransactionForm 
        initialData={editingItem} 
        onClear={() => setEditingItem(null)} 
      />
      <TransactionList 
        items={initialData || []} 
        onEdit={(item) => setEditingItem(item)} 
      />
    </div>
  );
}