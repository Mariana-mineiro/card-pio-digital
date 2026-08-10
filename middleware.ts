import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se a rota começa com /admin (ex: /admin, /admin/produtos, etc.)
  if (pathname.startsWith("/admin")) {
    // Procura o token de autenticação nos cookies (ajuste o nome do cookie conforme o seu projeto, ex: "sb-access-token" se usar Supabase)
    const authToken = request.cookies.get("token")?.value || request.cookies.get("sb-access-token")?.value;

    // Se não tiver token, redireciona para a página de login
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      // Opcional: Salva para onde ele queria ir para redirecionar depois do login
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Para qualquer outra página (cardápio normal, home, etc.), o middleware deixa passar livremente
  return NextResponse.next();
}

// Configura em quais rotas o middleware deve rodar
export const config = {
  matcher: ["/admin/:path*"],
};