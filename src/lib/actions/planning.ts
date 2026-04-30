// src/lib/actions/planning.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function upsertPlanning(values: any, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.planning.upsert({
      where: { id: id || "new-id" },
      update: {
        description: values.description,
        percentage: values.percentage,
        financialGroupId: values.financialGroupId,
      },
      create: {
        description: values.description,
        percentage: values.percentage,
        financialGroupId: values.financialGroupId,
        userId: session.user.id,
      },
    });

    revalidatePath("/planning");
    return { success: "Meta salva!" };
  } catch (error) {
    return { error: "Erro ao salvar." };
  }
}

export async function deletePlanning(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.planning.deleteMany({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/planning");
    return { success: "Meta removida!" };
  } catch (error) {
    return { error: "Erro ao excluir." };
  }
}