import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.985_0.002_85)] px-4 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-6xl">🔍</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Página não encontrada</h1>
        <p className="text-sm text-slate-600">
          Ops! O prato ou a página que você está procurando não existe ou foi removido do cardápio.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6">
              Voltar ao Cardápio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}