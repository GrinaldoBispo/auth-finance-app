// src/lib/actions/transactions.ts

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertTransaction(values: any, id?: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    if (id) {
      // UPDATE
      await prisma.transaction.update({
        where: { id, userId: session.user.id },
        data: {
          description: values.description,
          amount: values.amount,
          date: new Date(values.date),
          category: values.category,
          type: values.type,
        },
      });
    } else {
      // CREATE
      await prisma.transaction.create({
        data: {
          description: values.description,
          amount: values.amount,
          date: new Date(values.date),
          category: values.category,
          type: values.type,
          userId: session.user.id,
        },
      });
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: id ? "Lançamento atualizado!" : "Gasto lançado com sucesso!" };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao salvar no banco de dados." };
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    await prisma.transaction.delete({
      where: { id, userId: session.user.id },
    });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: "Lançamento excluído!" };
  } catch (error) {
    return { error: "Erro ao excluir lançamento." };
  }
}