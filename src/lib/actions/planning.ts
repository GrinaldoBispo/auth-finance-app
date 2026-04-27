// src/lib/actions/planning.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { PlanningSchema, PlanningFormValues } from "@/lib/validations/finance";

export async function upsertPlanning(data: PlanningFormValues, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    if (id) {
      await prisma.planning.update({
        where: { id, userId: session.user.id },
        data,
      });
    } else {
      await prisma.planning.create({
        data: { ...data, userId: session.user.id },
      });
    }
    revalidatePath("/planning");
    return { success: "Planejamento atualizado!" };
  } catch (error) {
    return { error: "Erro ao salvar planejamento." };
  }
}

export async function deletePlanning(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    await prisma.planning.delete({
      where: { 
        id, 
        userId: session.user.id 
      },
    });

    revalidatePath("/planning");
    return { success: "Meta de planejamento removida!" };
  } catch (error) {
    console.error("DELETE_PLANNING_ERROR", error);
    return { error: "Erro ao excluir o item de planejamento." };
  }
}