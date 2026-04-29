// src/lib/validations/user.ts

import * as z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  username: z.string().min(2, "Username muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional().or(z.literal("")),
  monthlyIncome: z.coerce.number().min(0),
  initialBalance: z.coerce.number().min(0),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;