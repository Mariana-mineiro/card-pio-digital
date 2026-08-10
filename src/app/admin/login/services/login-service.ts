import type { LoginCredentials } from "@/app/admin/login/types/login-types";
import { createClient } from "@/lib/supabase/client";

export async function signInAdmin({ email, password }: LoginCredentials) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Traduz e amigabiliza os erros comuns do Supabase Auth para português
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("E-mail ou senha incorretos. Verifique seus dados.");
    }
    if (error.message.includes("Email not confirmed")) {
      throw new Error("E-mail ainda não confirmado. Verifique sua caixa de entrada.");
    }
    throw new Error("Ocorreu um erro ao tentar entrar. Tente novamente.");
  }

  return data;
}