// src/lib/actions/setup-user.ts

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setupUserAction(formData: { income: number; balance: number }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    // 1. Atualiza o usuário
    await tx.user.update({
      where: { id: userId },
      data: {
        monthlyIncome: formData.income,
        initialBalance: formData.balance,
      },
    });

    // 2. Checa se já existe plano
    const existingPlanning = await tx.planning.findFirst({
      where: { userId }
    });

    if (!existingPlanning) {
      // 3. Define as categorias com os campos que o Prisma exigiu no erro
      const categories = [
        { 
          name: "Essenciais", 
          category: "essentials", // Campo 'category' exigido
          percentage: 50, 
          description: "Gastos fixos e sobrevivência" // Campo 'description' exigido
        },
        { 
          name: "Estilo de Vida", 
          category: "lifestyle", 
          percentage: 30, 
          description: "Lazer e desejos pessoais" 
        },
        { 
          name: "Investimentos", 
          category: "investments", 
          percentage: 20, 
          description: "Reserva e futuro" 
        },
      ];

      await tx.planning.createMany({
	  data: categories.map((cat) => ({
		userId,
		category: cat.category,    // Confirmado que existe
		percentage: cat.percentage, // Confirmado que existe
		description: cat.description, // Confirmado que existe
		// REMOVEMOS o suggestedValue e o categoryName daqui
	  })),
	});
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/planning");
  
  return { success: true };
}