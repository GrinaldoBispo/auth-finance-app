// src/lib/actions/setup-user.ts

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setupUserAction(values: { income: number; balance: number }) {
  const session = await auth();
  
  // Pegamos o ID e o Email da sessão
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId || !userEmail) return { error: "Não autorizado ou sessão inválida" };

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Atualiza usando o EMAIL como âncora (mais seguro que o ID em sessões instáveis)
      // Usamos updateMany para não lançar erro P2025 se o ID for incompatível
      await tx.user.updateMany({
        where: { 
          OR: [
            { id: userId },
            { email: userEmail }
          ]
        },
        data: {
          monthlyIncome: Number(values.income),
          initialBalance: Number(values.balance),
        },
      });

      // 2. Garante Grupos Globais
      const groups = [
        { name: 'Essenciais', slug: 'essentials', color: '#3b82f6' },
        { name: 'Estilo de Vida', slug: 'lifestyle', color: '#10b981' },
        { name: 'Investimentos', slug: 'investments', color: '#f59e0b' },
      ];

      for (const group of groups) {
        await tx.financialGroup.upsert({
          where: { slug: group.slug },
          update: {},
          create: group,
        });
      }

      const dbGroups = await tx.financialGroup.findMany();
      const essentials = dbGroups.find(g => g.slug === 'essentials');
      const lifestyle = dbGroups.find(g => g.slug === 'lifestyle');
      const investments = dbGroups.find(g => g.slug === 'investments');

      // 3. Cria o Planejamento Padrão
      const existingPlanning = await tx.planning.findFirst({ where: { userId } });
      
      if (!existingPlanning) {
        await tx.planning.createMany({
          data: [
            { description: "Gastos Fixos", percentage: 50, userId, financialGroupId: essentials!.id },
            { description: "Estilo de Vida", percentage: 30, userId, financialGroupId: lifestyle!.id },
            { description: "Investimentos", percentage: 20, userId, financialGroupId: investments!.id },
          ],
        });
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("SETUP_ERROR:", error);
    return { error: "Erro ao configurar banco de dados." };
  }
}