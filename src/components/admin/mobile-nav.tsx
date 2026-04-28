// src/components/admin/mobile-nav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  CalendarClock, 
  CreditCard, 
  Settings, 
  User,
  Receipt,
  ShieldCheck // Ícone sugerido para o Admin
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ role }: { role?: string }) {
  const pathname = usePathname();

  // Rotas padrão para todos os usuários
  const routes = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Gastos", icon: Receipt, href: "/transactions" }, // Adicione o ícone Receipt
  { label: "Metas", icon: Target, href: "/planning" },
  { label: "Cards", icon: CreditCard, href: "/cards" },
  { label: "Fixos", icon: CalendarClock, href: "/fixed-expenses" },
  { label: "Perfil", icon: User, href: "/settings" },
];

  // Adiciona o Painel Admin apenas se for ADMIN
  if (role === "ADMIN") {
    routes.push({ label: "Admin", icon: ShieldCheck, href: "/admin" });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 px-1 py-2 md:hidden">
      <nav className="flex justify-around items-center">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center gap-1.5 p-1 transition-all duration-200",
                isActive ? "text-blue-600 scale-110" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <route.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter",
                isActive ? "opacity-100" : "opacity-80"
              )}>
                {route.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}