"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.985_0.002_85)] px-4 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-6xl">⚠️</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Algo deu errado!</h1>
        <p className="text-sm text-slate-600">
          Ocorreu um erro inesperado no servidor. Nossa equipe já foi avisada, ou você pode tentar novamente.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            onClick={() => reset()}
            className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6"
          >
            Tentar novamente.
          </Button>
        </div>
      </div>
    </div>
  );
}