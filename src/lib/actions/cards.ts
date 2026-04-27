// src/lib/actions/cards.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { CardSchema, CardFormValues } from "@/lib/validations/finance";

export async function upsertCreditCard(data: CardFormValues, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const validatedFields = CardSchema.safeParse(data);
  if (!validatedFields.success) return { error: "Campos inválidos" };

  try {
    if (id) {
      await prisma.creditCard.update({
        where: { id, userId: session.user.id },
        data: validatedFields.data,
      });
    } else {
      await prisma.creditCard.create({
        data: { ...validatedFields.data, userId: session.user.id },
      });
    }
    revalidatePath("/cards");
    return { success: id ? "Cartão atualizado!" : "Cartão criado!" };
  } catch (error) {
    return { error: "Erro na operação com o banco de dados." };
  }
}

export async function deleteCreditCard(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.creditCard.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/cards");
    return { success: "Cartão removido!" };
  } catch (error) {
    return { error: "Erro ao excluir cartão." };
  }
}