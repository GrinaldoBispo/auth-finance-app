// src/lib/actions/onboarding.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function completeUserOnboarding(userId: string, initialBalance: number, monthlyIncome: number) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Atualiza os dados financeiros básicos do usuário
      await tx.user.update({
        where: { id: userId },
        data: {
          initialBalance,
          monthlyIncome,
        },
      });

      // 2. Garante que os Grupos Globais existam (Upsert neles)
      const groupData = [
        { name: 'Essenciais', slug: 'essentials', color: '#3b82f6' },
        { name: 'Estilo de Vida', slug: 'lifestyle', color: '#10b981' },
        { name: 'Investimentos', slug: 'investments', color: '#f59e0b' },
      ];

      // Criamos/Verificamos os grupos e já pegamos os IDs
      const groups = await Promise.all(
        groupData.map(g => 
          tx.financialGroup.upsert({
            where: { slug: g.slug },
            update: {},
            create: g
          })
        )
      );

      const essentials = groups.find(g => g.slug === 'essentials');
      const lifestyle = groups.find(g => g.slug === 'lifestyle');
      const investments = groups.find(g => g.slug === 'investments');

      // 3. Cria o Planejamento Padrão (50/30/20) para este usuário
      // Verificamos se ele já não tem planejamento para não duplicar
      const hasPlanning = await tx.planning.findFirst({ where: { userId } });
      
      if (!hasPlanning) {
        await tx.planning.createMany({
          data: [
            {
              description: "Gastos Fixos e Sobrevivência",
              percentage: 50,
              userId,
              financialGroupId: essentials!.id,
            },
            {
              description: "Lazer e Estilo de Vida",
              percentage: 30,
              userId,
              financialGroupId: lifestyle!.id,
            },
            {
              description: "Reserva e Investimentos",
              percentage: 20,
              userId,
              financialGroupId: investments!.id,
            },
          ],
        });
      }

      return { success: true };
    });
  } catch (error) {
    console.error("ONBOARDING_ERROR", error);
    return { error: "Falha ao configurar sua conta." };
  }
}