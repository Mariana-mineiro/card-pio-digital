import { Database } from "@/types/supabase";
import * as yup from "yup";

export type Settings = Database["public"]["Tables"]["settings"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export type ProductFormData = {
  name: string;
  description: string;
  price: number | string;
  category_id: string;
  is_available: boolean;
  image?: FileList;
};

// Schemas do Yup para validação com React Hook Form nos Modais
export const productSchema = yup.object({
  name: yup.string().required("O nome do prato é obrigatório"),
  description: yup.string().default(""),
  price: yup.mixed().required("O preço é obrigatório"),
  category_id: yup.string().required("Selecione uma categoria"),
  is_available: yup.boolean().required(),
  image: yup.mixed().optional(),
});

export const categorySchema = yup.object({
  name: yup.string().required("O nome da categoria é obrigatório"),
});

export type CategoryFormData = yup.InferType<typeof categorySchema>;