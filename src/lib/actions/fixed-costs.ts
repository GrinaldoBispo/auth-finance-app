// src/lib/actions/fixed-costs.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { FixedCostSchema, type FixedCostFormValues } from "@/lib/validations/finance";

export async function upsertFixedCost(data: FixedCostFormValues, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const validatedFields = FixedCostSchema.safeParse(data);
  if (!validatedFields.success) return { error: "Campos inválidos" };

  try {
    if (id) {
      await prisma.fixedCost.update({
        where: { id, userId: session.user.id },
        data: validatedFields.data,
      });
    } else {
      await prisma.fixedCost.create({
        data: { ...validatedFields.data, userId: session.user.id },
      });
    }
    revalidatePath("/fixed-expenses");
    return { success: id ? "Custo atualizado!" : "Custo fixo adicionado!" };
  } catch (error) {
    return { error: "Erro ao salvar no banco de dados." };
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