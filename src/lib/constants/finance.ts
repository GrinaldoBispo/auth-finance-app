// src/lib/constants/finance.ts

export const GROUP_CONFIG = {
  ESSENTIALS: {
    label: "Essenciais",
    color: "#3b82f6", // Blue-500
    bg: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-200",
  },
  LIFESTYLE: {
    label: "Estilo de Vida",
    color: "#eab308", // Yellow-500
    bg: "bg-yellow-500",
    text: "text-yellow-500",
    border: "border-yellow-200",
  },
  INVESTMENTS: {
    label: "Investimentos",
    color: "#22c55e", // Green-500
    bg: "bg-green-500",
    text: "text-green-500",
    border: "border-green-200",
  },
} as const;

export type CategoryGroup = keyof typeof GROUP_CONFIG;