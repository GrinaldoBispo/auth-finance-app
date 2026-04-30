// src/lib/actions/transactions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function upsertTransaction(values: any, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    const userId = session.user.id;

    // VALIDAR SE O PLANNING ID EXISTE
    if (!values.planningId) {
      return { error: "Você precisa selecionar uma meta do planejamento." };
    }

    const data = {
      description: values.description,
      amount: Number(values.amount),
      date: new Date(values.date),
      type: values.type || "EXPENSE",
      paymentMethod: values.paymentMethod || "CASH",
      installments: values.paymentMethod === "CREDIT_CARD" ? Number(values.installments || 1) : 1,
      // Conexão com a meta do planejamento (Obrigatório)
      planningId: values.planningId, 
      // Conexão opcional com cartão
      creditCardId: values.paymentMethod === "CREDIT_CARD" ? values.creditCardId : null,
      userId,
    };

    if (id) {
      await prisma.transaction.update({ 
        where: { id, userId }, 
        data 
      });
    } else {
      await prisma.transaction.create({ 
        data 
      });
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { success: "Lançamento realizado com sucesso!" };
  } catch (error) {
    console.error("ERRO_TRANSACTION:", error);
    return { error: "Erro ao salvar no banco. Verifique se todos os campos foram preenchidos." };
  }
}

// ADICIONE ESTA FUNÇÃO QUE ESTAVA FALTANDO:
export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.transaction.delete({
      where: { 
        id, 
        userId: session.user.id 
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { success: "Lançamento removido!" };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao excluir lançamento." };
  }
}