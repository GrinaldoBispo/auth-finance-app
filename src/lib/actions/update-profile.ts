// src/lib/actions/update-profile.ts

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: any) { // Mudamos para receber objeto direto do form
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  const { name, username, password, monthlyIncome, initialBalance } = values;

  try {
    // 1. Validação de Username duplicado
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return { error: "Este username já está em uso por outra pessoa." };
      }
    }

    // 2. Montagem do objeto de update
    const updateData: any = {
	  name: values.name,
	  username: values.username,
	  email: values.email, // Adicionado e-mail
	  monthlyIncome: Number(values.monthlyIncome),
	  initialBalance: Number(values.initialBalance),
	};

	if (values.password && values.password.length >= 6) {
	  updateData.password = await hash(values.password, 10);
	}

    // 3. Hash da senha
    if (password && password.length > 0) {
      if (password.length < 6) {
        return { error: "A senha deve ter pelo menos 6 caracteres." };
      }
      updateData.password = await hash(password, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return { success: "Perfil atualizado com sucesso!" };
  } catch (error) {
    console.error(error);
    return { error: "Ocorreu um erro ao atualizar seus dados." };
  }
}