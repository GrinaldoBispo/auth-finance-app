// src/lib/validations/finance.ts

import * as z from "zod";

export const CardSchema = z.object({
  name: z.string().min(2, "O nome do cartão é obrigatório"),
  closingDay: z.coerce.number().int().min(1).max(31),
  dueDay: z.coerce.number().int().min(1).max(31),
});

export type CardFormValues = z.infer<typeof CardSchema>;

export const FixedCostSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "O valor deve ser maior que zero"),
  dueDate: z.number().min(1).max(31, "Dia deve ser entre 1 e 31"),
  planningId: z.string().min(1, "Selecione uma meta do planejamento"), // MUDAR AQUI de categoryId para planningId
});

export type FixedCostFormValues = z.infer<typeof FixedCostSchema>;

export const PlanningSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  group: z.enum(["ESSENTIALS", "LIFESTYLE", "INVESTMENTS"]),
  percentage: z.coerce.number().min(0).max(100),
});

export type PlanningFormValues = z.infer<typeof PlanningSchema>;

export const TransactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "O valor deve ser maior que zero"),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.enum(["INCOME", "EXPENSE"]),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD"]),
  // planningId deve ser obrigatório
  planningId: z.string().min(1, "Selecione uma meta do planejamento"),
  // Campos opcionais
  creditCardId: z.string().optional(),
  installments: z.number().min(1).optional().default(1),
});

export type TransactionFormValues = z.infer<typeof TransactionSchema>;
