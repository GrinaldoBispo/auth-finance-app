// src/lib/actions/reset-account.ts

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function resetAccount() { // Nome ajustado para o seu fluxo
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error("RESET_ERROR: Sessão não encontrada");
    return { error: "Não autorizado" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Limpa todos os dados relacionados
      // Usamos deleteMany porque ele não falha se a lista estiver vazia
      await tx.fixedCost.deleteMany({ where: { userId } });
      await tx.transaction.deleteMany({ where: { userId } });
      await tx.planning.deleteMany({ where: { userId } });
      await tx.creditCard.deleteMany({ where: { userId } });

      // 2. Zera os valores do usuário
      // Mudamos de .update para .updateMany para evitar o erro P2025
      const result = await tx.user.updateMany({
        where: { id: userId },
        data: {
          monthlyIncome: 0,
          initialBalance: 0,
        },
      });

      console.log(`Reset concluído para o usuário ${userId}. Registros afetados:`, result.count);
    });

    revalidatePath("/");
    return { success: "Sua conta foi zerada com sucesso!" };
  } catch (error) {
    console.error("RESET_ACCOUNT_CRITICAL_ERROR", error);
    return { error: "Erro técnico ao zerar conta. Tente novamente." };
  }
}