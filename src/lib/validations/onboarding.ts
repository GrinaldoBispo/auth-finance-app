// src/lib/validations/onboarding.ts

import * as z from "zod";

export const OnboardingSchema = z.object({
  income: z.coerce.number().min(1, "A renda deve ser maior que zero"),
  balance: z.coerce.number().min(0).default(0),
});

export type OnboardingValues = z.infer<typeof OnboardingSchema>;