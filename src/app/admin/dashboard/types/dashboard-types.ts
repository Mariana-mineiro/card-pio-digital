import { Database } from "@/types/supabase";

export type Settings = Database["public"]["Tables"]["settings"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_available: boolean;
  image?: FileList;
};