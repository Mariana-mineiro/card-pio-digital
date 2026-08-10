"use client";

import { useLogin } from "@/app/admin/login/hooks/use-login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Digite um e-mail válido").required("O e-mail é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    isSubmitting,
    message,
    setEmail,
    setPassword,
    submitLogin,
  } = useLogin({
    onSuccess: () => router.push("/admin/dashboard"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setEmail(data.email);
    setPassword(data.password);
    await submitLogin();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Admin
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
            Acesse o painel
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login com o Supabase Auth para gerenciar o seu cardápio.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none text-card-foreground"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="admin@restaurante.com"
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none text-card-foreground"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          {message ? (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>

        <div className="mt-6 text-center">
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