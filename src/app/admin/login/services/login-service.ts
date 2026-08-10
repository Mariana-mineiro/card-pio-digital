import { createClient } from "@/lib/supabase/client";
import { AdminLoginFormData } from "../types/login-types";

export async function loginAdmin({ email, password }: AdminLoginFormData) {
  // Inicializa o cliente do Supabase
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}