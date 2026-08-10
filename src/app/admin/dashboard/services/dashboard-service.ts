import type {
  Category,
  MenuItem,
  Settings,
} from "@/app/admin/dashboard/types/dashboard-types";
import { createClient } from "@/lib/supabase/client";

export async function getDashboardSettings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Settings | null;
}

export async function getDashboardCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getDashboardMenuItems() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuItem[];
}

export async function updateDashboardSettings(next: Settings) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .update(next)
    .eq("id", next.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Settings;
}

export async function createDashboardCategory(name: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function updateDashboardCategory(id: string, name: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function deleteDashboardCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("pratos_imagens")
    .upload(filePath, file);

  if (uploadError) throw new Error(`Erro ao enviar imagem: ${uploadError.message}`);

  const { data } = supabase.storage.from("pratos_imagens").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createDashboardMenuItem(
  payload: Omit<MenuItem, "id" | "created_at">,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as MenuItem;
}

export async function updateDashboardMenuItem(
  id: string,
  payload: Partial<MenuItem>,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as MenuItem;
}

export async function deleteDashboardMenuItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}