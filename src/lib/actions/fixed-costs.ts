// src/lib/actions/fixed-costs.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function upsertFixedCost(data: any, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    const userId = session.user.id;

    // Preparamos os dados para o Prisma
    // Importante: O campo no banco agora é planningId
    const payload = {
      description: data.description,
      amount: Number(data.amount),
      dueDate: Number(data.dueDate),
      planningId: data.planningId, // Certifique-se que o Form envia como planningId
      userId: userId,
    };

    if (id) {
      await prisma.fixedCost.update({
        where: { id, userId },
        data: payload,
      });
    } else {
      await prisma.fixedCost.create({
        data: payload,
      });
    }

    revalidatePath("/fixed-expenses");
    revalidatePath("/dashboard");
    return { success: id ? "Custo atualizado!" : "Custo fixo adicionado!" };
  } catch (error) {
    console.error("UPSERT_FIXED_COST_ERROR:", error);
    return { error: "Erro ao salvar no banco de dados. Verifique os campos." };
  }
}

export async function deleteFixedCost(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.fixedCost.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/fixed-expenses");
    return { success: "Removido com sucesso!" };
  } catch (error) {
    return { error: "Erro ao excluir." };
  }
}