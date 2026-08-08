import { Database } from "@/types/supabase"; // Ajuste o caminho conforme onde você salvou o arquivo gerado pelo supabase gen types

// Tipos extraídos diretamente do schema do seu banco de dados Supabase
export type Settings = Database["public"]["Tables"]["settings"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];