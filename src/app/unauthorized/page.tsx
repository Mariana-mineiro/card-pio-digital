import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.985_0.002_85)] px-4 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-6xl">🚫</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Acesso Não Autorizado</h1>
        <p className="text-sm text-slate-600">
          Você não possui permissão para acessar esta área restrita do painel administrativo.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button variant="outline" className="rounded-2xl font-bold border-slate-300 text-slate-800">
              Fazer Login
            </Button>
          </Link>
          <Link href="/">
            <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
              Ir para o Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}