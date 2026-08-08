"use client";

import { useLogin } from "@/app/admin/login/hooks/use-login";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    email,
    password,
    isSubmitting,
    message,
    setEmail,
    setPassword,
    submitLogin,
  } = useLogin({
    onSuccess: () => router.push("/admin/dashboard"),
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-50">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Acesse o painel</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Faça login com o Supabase Auth para ter acesso ao painel do
            restaurante.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submitLogin();
          }}
          className="mt-8 space-y-4"
        >
          <div>
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
              placeholder="admin@restaurante.com"
              required
            />
          </div>
          <div>
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {message ? <p className="text-sm text-slate-300">{message}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-slate-200"
          >
            Voltar ao cardápio público
          </Link>
        </div>
      </div>
    </main>
  );
}
