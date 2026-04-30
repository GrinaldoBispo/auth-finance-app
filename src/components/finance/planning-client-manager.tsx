// src/components/finance/planning-client-manager.tsx

"use client";

import { useState } from "react";
import { PlanningForm } from "./planning-form";
import { PlanningList } from "./planning-list";
import { PageHeaderCard } from "@/components/ui/page-header-card";
import { Button } from "@/components/ui/button";
import { upsertPlanning } from "@/lib/actions/planning";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Definimos uma interface básica para o Item do Planejamento
interface PlanningItem {
  id: string;
  description: string;
  percentage: number;
  financialGroupId: string;
  financialGroup?: {
    id?: string;
    name: string;
    color: string;
  };
}

export function PlanningClientManager({ initialData, groups }: { initialData: any[], groups: any[] }) {
  const [items, setItems] = useState<PlanningItem[]>(initialData);
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const totalPercentage = items.reduce((acc, item) => acc + Number(item.percentage), 0);

  const handleSaveLocal = (formData: any) => {
    const groupInfo = groups.find(g => g.id === formData.financialGroupId);

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData, financialGroup: groupInfo } : i));
    } else {
      setItems([...items, { 
        ...formData, 
        id: `temp-${Math.random().toString(36).substring(2, 9)}`,
        financialGroup: groupInfo 
      }]);
    }
    setEditingItem(null);
  };

  async function handleFinalSubmit() {
    if (totalPercentage !== 100) {
      return toast.error("O total deve ser exatamente 100%.");
    }

    setLoading(true);
    try {
      for (const item of items) {
        // Removemos o prefixo 'temp-' para o banco gerar um ID real ou usamos o ID existente
        const idToSend = item.id.startsWith('temp-') ? undefined : item.id;
        await upsertPlanning(item, idToSend);
      }
      toast.success("Planejamento sincronizado!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar no banco.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeaderCard 
        label="Planejamento Geral" 
        value={`${totalPercentage}%`}
      >
        <p className={`text-[10px] italic font-bold ${totalPercentage > 100 ? "text-red-500" : "text-zinc-500"}`}>
          {totalPercentage > 100 
            ? "* Atenção: O total ultrapassou 100%!" 
            : "* Definição de limites por categoria mestre."}
        </p>
      </PageHeaderCard>

      <PlanningForm 
        initialData={editingItem} 
        groups={groups}
        onSave={handleSaveLocal}
        onClear={() => setEditingItem(null)} 
      />

      <div className="space-y-4">
        {/* TIPAGEM ADICIONADA NOS CALLBACKS ABAIXO */}
        <PlanningList 
          items={items} 
          onEdit={(item: PlanningItem) => setEditingItem(item)}
          onDelete={(id: string) => setItems(items.filter(i => i.id !== id))}
        />

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleFinalSubmit}
            disabled={totalPercentage !== 100 || loading}
            className={`w-full md:w-auto px-10 font-bold h-12 shadow-lg transition-all ${
              totalPercentage === 100 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-300"
            }`}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
            CONFIRMAR E SALVAR PLANEJAMENTO
          </Button>
        </div>
      </div>
    </div>
  );
}