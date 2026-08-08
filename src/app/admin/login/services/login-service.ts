import type { LoginCredentials } from "@/app/admin/login/types/login-types";
import { createClient } from "@/lib/supabase/client";

export async function signInAdmin({ email, password }: LoginCredentials) {
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
