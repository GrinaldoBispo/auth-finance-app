// src/lib/validations/finance.ts

import * as z from "zod";

export const CardSchema = z.object({
  name: z.string().min(2, "O nome do cartão é obrigatório"),
  // z.coerce garante que o valor seja convertido para número antes da validação
  closingDay: z.coerce.number().int().min(1).max(31),
  dueDay: z.coerce.number().int().min(1).max(31),
});

// Este export é fundamental para o useForm
export type CardFormValues = z.infer<typeof CardSchema>;

export const FixedCostSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.coerce.number().min(0.01, "O valor deve ser maior que zero"),
  dueDate: z.coerce.number().int().min(1).max(31, "Dia inválido"),
});

export type FixedCostFormValues = z.infer<typeof FixedCostSchema>;

export const PlanningSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  category: z.enum(["essentials", "lifestyle", "investments"]),
  percentage: z.coerce.number().min(0).max(100),
});

export type PlanningFormValues = z.infer<typeof PlanningSchema>;

export const TransactionSchema = z.object({
  description: z.string().min(2, "Descrição muito curta"),
  amount: z.coerce.number().min(0.01, "O valor deve ser maior que zero"),
  date: z.string().or(z.date()),
  category: z.string().default("others"),
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
});

export type TransactionFormValues = z.infer<typeof TransactionSchema>;

