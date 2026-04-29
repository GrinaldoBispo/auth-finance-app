"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function resetAccount() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    const userId = session.user.id;

    // Executamos a limpeza em uma transação: ou apaga TUDO ou não apaga NADA
    await prisma.$transaction([
      // 1. Apaga Planejamentos (Regra 50/30/20)
      prisma.planning.deleteMany({ where: { userId } }),
      
      // 2. Apaga Cartões de Crédito
      prisma.creditCard.deleteMany({ where: { userId } }),
      
      // 3. Apaga Gastos Fixos
      prisma.fixedCost.deleteMany({ where: { userId } }),

      // 4. Se você tiver uma tabela de transações/gastos variáveis, adicione aqui:
      // prisma.transaction.deleteMany({ where: { userId } }),

      // 5. Por fim, zera os valores mestre do usuário
      prisma.user.update({
        where: { id: userId },
        data: { 
          monthlyIncome: 0, 
          initialBalance: 0 
        }
      })
    ]);

    // Limpa o cache para o sistema entender que os dados sumiram
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/planning");
	revalidatePath("/cards");

    return { success: "Todos os dados (Planos, Cartões e Fixos) foram apagados!" };
  } catch (error) {
    console.error("Erro ao resetar banco:", error);
    return { error: "Erro ao tentar limpar as tabelas. Verifique as dependências." };
  }
}