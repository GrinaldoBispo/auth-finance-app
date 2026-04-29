// src/proxy.ts

import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname === "/"; 
  
  // Rotas de autenticação (Login, Register, etc.)
  const isAuthRoute = 
    nextUrl.pathname.startsWith("/login") || 
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password");

  // 1. DEFINA A ROTA DE ONBOARDING
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding");

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return;
  }

  // 2. LÓGICA DE BLOQUEIO
  // Se não está logado e não é rota pública/auth, manda pro login
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // 3. (OPCIONAL) REDIRECIONAMENTO AUTOMÁTICO PARA ONBOARDING
  // Se você quiser que o sistema SEMPRE force o onboarding se a renda for 0,
  // poderíamos checar aqui, mas como o Middleware deve ser leve, 
  // é melhor fazer essa checagem direto no layout.tsx ou na dashboard/page.tsx
  // como discutimos antes.

  return;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};