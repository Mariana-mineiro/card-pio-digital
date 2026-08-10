import { createClient } from "@/lib/supabase/client";
import { Category, MenuItem, Settings } from "../types/home-types";

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

export async function getHomeSettings() {
  return withRetry(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as Settings | null;
  });
}

export async function getHomeCategories() {
  return withRetry(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (error) throw new Error(error.message);
    return (data ?? []) as Category[];
  });
}

export async function getHomeMenuItems() {
  return withRetry(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("name");
    if (error) throw new Error(error.message);
    return (data ?? []) as MenuItem[];
  });
}