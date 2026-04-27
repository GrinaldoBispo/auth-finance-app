// src/lib/actions/cards.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addCreditCard(data: { name: string; closingDay: number; dueDay: number }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.creditCard.create({
      data: {
        name: data.name,
        closingDay: data.closingDay,
        dueDay: data.dueDay,
        userId: session.user.id,
      },
    });
    revalidatePath("/card");
    return { success: "Cartão adicionado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao salvar no banco de dados." };
  }
}

export async function deleteCreditCard(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  await prisma.creditCard.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/card");
  return { success: "Cartão removido!" };
}