// src/components/admin/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Mail, 
  User, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  CalendarClock, // Ícone sugerido para Custos Fixos
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";

  const routes = [
    // --- SEÇÃO ADMINISTRATIVA ---
    {
      label: "Painel Geral",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
      color: "text-blue-600",
      hide: !isAdmin,
    },
    {
      label: "Configurações SMTP",
      icon: Mail,
      href: "/email",
      active: pathname === "/email",
      color: "text-red-600",
      hide: !isAdmin,
    },
    // --- SEÇÃO DO USUÁRIO / WEB APP ---
    {
      label: "Meu Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
      color: "text-emerald-600",
      hide: false,
    },
    {
      label: "Meus Cartões",
      icon: CreditCard,
      href: "/cards",
      active: pathname === "/cards",
      color: "text-orange-600",
      hide: false,
    },
    {
      label: "Custos Fixos", // Nova aba integrada do Web App Financeiro
      icon: CalendarClock,
      href: "/fixed",
      active: pathname === "/fixed",
      color: "text-blue-500",
      hide: false,
    },
    {
      label: "Meu Perfil",
      icon: User,
      href: "/settings",
      active: pathname === "/settings",
      color: "text-zinc-500",
      hide: false,
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r border-zinc-200 min-w-[260px] shadow-sm">
      <div className="px-6 py-2 flex items-center gap-2 mb-6">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-zinc-800 tracking-tight italic">
          Auth<span className="text-blue-600">Mastery</span>
        </h1>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {isAdmin && (
          <p className="text-[10px] font-bold text-zinc-400 uppercase px-3 mb-2 tracking-widest">
            Administração
          </p>
        )}
        
        {routes.map((route) => {
          if (route.hide) return null;

          const showDivider = isAdmin && route.href === "/dashboard";

          return (
            <div key={route.href}>
              {showDivider && (
                <p className="text-[10px] font-bold text-zinc-400 uppercase px-3 mt-6 mb-2 tracking-widest">
                  Pessoal
                </p>
              )}
              <Link
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-zinc-100 rounded-lg transition-all",
                  route.active ? "text-zinc-900 bg-zinc-100" : "text-zinc-500",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
                {route.active && <ChevronRight className="h-4 w-4 ml-auto text-zinc-400" />}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="px-3 pt-4 border-t border-zinc-200">
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mb-2"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}