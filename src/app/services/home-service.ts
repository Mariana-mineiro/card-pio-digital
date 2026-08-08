import { createClient } from "@/lib/supabase/client";
import { Category, MenuItem, Settings } from "../types/home-types";

export async function getHomeSettings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Settings | null;
}

export async function getHomeCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getHomeMenuItems() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuItem[];
}