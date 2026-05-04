// src/lib/actions/transactions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function upsertTransaction(values: any, id?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    const userId = session.user.id;
    if (!values.planningId) return { error: "Selecione uma meta." };

    const installments = values.paymentMethod === "CREDIT_CARD" ? Number(values.installments || 1) : 1;
    // O valor que vai para o banco agora é SEMPRE o valor da parcela
    const installmentValue = Number(values.amount) / installments;
    const purchaseId = crypto.randomUUID(); 
    const baseDate = new Date(values.date);

    // Se for edição (ID presente), atualizamos apenas o registro específico
    // (Em um sistema complexo, editar parcelas exige logica extra, mas vamos no essencial)
    if (id) {
      await prisma.transaction.update({
        where: { id, userId },
        data: {
          description: values.description,
          amount: Number(values.amount), // Na edição manual, assume-se o valor inserido
          date: baseDate,
          planningId: values.planningId,
          creditCardId: values.paymentMethod === "CREDIT_CARD" ? values.creditCardId : null,
        }
      });
    } 
    // CRIAÇÃO DE NOVOS LANÇAMENTOS (Com desmembramento)
    else {
      let closingOffset = 0;
      
      // Lógica de Fechamento de Fatura
      if (values.paymentMethod === "CREDIT_CARD" && values.creditCardId) {
        const card = await prisma.creditCard.findUnique({ where: { id: values.creditCardId } });
        if (card && card.closingDay !== 1 && baseDate.getDate() >= card.closingDay) {
          closingOffset = 1;
        }
      }

      const transactionsData = [];

      for (let i = 0; i < installments; i++) {
        const targetDate = new Date(baseDate);
        // Soma o mês da compra + offset de fechamento + índice da parcela
        targetDate.setMonth(baseDate.getMonth() + closingOffset + i);

        transactionsData.push({
          description: installments > 1 ? `${values.description} (${i + 1}/${installments})` : values.description,
          amount: installmentValue,
          date: targetDate,
          type: values.type || "EXPENSE",
          paymentMethod: values.paymentMethod || "CASH",
          installments: installments,
          currentInstallment: i + 1,
          purchaseId: purchaseId, // RG da compra para deletar tudo junto depois
          planningId: values.planningId,
          creditCardId: values.paymentMethod === "CREDIT_CARD" ? values.creditCardId : null,
          userId,
        });
      }

      await prisma.transaction.createMany({ data: transactionsData });
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { success: "Lançamento realizado!" };
  } catch (error) {
    console.error("ERRO_TRANSACTION:", error);
    return { error: "Erro ao salvar no banco." };
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  try {
    // Primeiro buscamos a transação para ver se ela faz parte de um grupo (purchaseId)
    const transaction = await prisma.transaction.findUnique({
      where: { id, userId: session.user.id }
    });

    if (!transaction) return { error: "Lançamento não encontrado." };

    // Se tiver purchaseId e for parcelado, deletamos a "família" toda
    if (transaction.purchaseId && transaction.installments && transaction.installments > 1) {
      await prisma.transaction.deleteMany({
        where: { purchaseId: transaction.purchaseId, userId: session.user.id }
      });
    } else {
      // Se for à vista, deleta só ela
      await prisma.transaction.delete({
        where: { id, userId: session.user.id }
      });
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { success: "Removido com sucesso!" };
  } catch (error) {
    return { error: "Erro ao excluir." };
  }
}