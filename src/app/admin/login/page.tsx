"use client";

import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAdminLogin } from "./hooks/use-login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    isPending,
    authError,
    showPassword,
    togglePassword,
    handleInputChange,
  } = useAdminLogin();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8 space-y-6">
        
        {/* Cabeçalho */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Admin
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
            Acesse o painel
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login para gerenciar o seu cardápio digital.
          </p>
        </div>

        {/* Mensagem de Erro de Autenticação */}
        {authError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-semibold">{authError}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@restaurante.com"
              {...register("email", { onChange: handleInputChange })}
              className="h-11 rounded-xl bg-muted/50 border-input focus:bg-background transition-all"
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { onChange: handleInputChange })}
                className="h-11 rounded-xl bg-muted/50 border-input pr-12 focus:bg-background transition-all"
              />
              <button
                type="button"
                onClick={togglePassword}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] mt-2"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </span>
            ) : (
              "Entrar no painel"
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground underline underline-offset-4"
          >
            Voltar ao cardápio público
          </Link>
        </div>
      </div>
    </main>
  );
}