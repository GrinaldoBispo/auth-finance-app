// src/lib/actions/fixed-costs.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addFixedCost(data: { description: string; amount: number; dueDate: number }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.fixedCost.create({
      data: {
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate,
        userId: session.user.id,
      },
    });
    revalidatePath("/fixed-expenses");
    return { success: "Custo fixo adicionado!" };
  } catch (error) {
    return { error: "Erro ao salvar no banco." };
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