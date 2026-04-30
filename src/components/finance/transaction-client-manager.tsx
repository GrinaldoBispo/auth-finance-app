// src/components/finance/transaction-client-manager.tsx

"use client";

import { useState } from "react";
import { TransactionForm } from "./transaction-form";
import { TransactionList } from "./transaction-list";

export function TransactionClientManager({ 
  initialData, 
  plannings, 
  creditCards 
}: { 
  initialData: any[], 
  plannings: any[],
  creditCards: any[]
}) {
  const [editingItem, setEditingItem] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <TransactionForm 
        initialData={editingItem} 
        plannings={plannings}
        creditCards={creditCards}
        onClear={() => setEditingItem(null)} 
      />
      <TransactionList 
        items={initialData || []} 
        onEdit={(item) => setEditingItem(item)} 
      />
    </div>
  );
}