"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Category, MenuItem, ProductFormData } from "../types/dashboard-types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  description: yup.string().default("").required("A descrição é obrigatória"),
  price: yup.string().required("O preço é obrigatório"),
  category_id: yup.string().required("Selecione uma categoria"),
  is_available: yup.boolean().required(),
  image: yup
    .mixed<FileList>()
    .test("required-image", "A foto do prato é obrigatória", function (value) {
      const { options } = this;
      const editingItem = (options.context as { editingItem?: MenuItem | null })?.editingItem;
      const hasNewFile = value && value.length > 0;
      const hasExistingImage = Boolean(editingItem?.image_url);

      return Boolean(hasNewFile || hasExistingImage);
    }),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  editingItem: MenuItem | null;
  onSubmit: (data: ProductFormData, id?: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  onOpenCategoryModal: () => void;
};

export function ProductModal({
  isOpen,
  onClose,
  categories,
  editingItem,
  onSubmit,
  isSubmitting,
  error,
  onOpenCategoryModal,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    context: { editingItem },
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category_id: "",
      is_available: true,
    },
  });

  const watchImage = watch("image");

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      setValue("name", editingItem.name);
      setValue("description", editingItem.description ?? "");
      const formattedPrice = Number(editingItem.price).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setValue("price", formattedPrice);
      setValue("category_id", editingItem.category_id ?? "");
      setValue("is_available", editingItem.is_available);
      setImagePreview(editingItem.image_url ?? null);
    } else {
      reset({
        name: "",
        description: "",
        price: "",
        category_id: "",
        is_available: true,
      });
      setImagePreview(null);
    }
  }, [editingItem, isOpen, reset, setValue]);

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [watchImage]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setValue("price", "");
      return;
    }
    const numberValue = Number(value) / 100;
    const formatted = numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValue("price", formatted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {editingItem ? "Editar Prato" : "Novo Prato"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs sm:text-sm text-rose-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(async (data) => {
            await onSubmit(data as unknown as ProductFormData, editingItem?.id);
            reset();
            setImagePreview(null);
          })}
          className="mt-4 space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nome do prato</label>
            <input {...register("name")} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500" placeholder="Ex: X-Burger Especial" />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Descrição</label>
            <textarea {...register("description")} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500" rows={3} placeholder="Ingredientes e detalhes..." />
            {/* Mensagem de erro da descrição adicionada aqui */}
            {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Preço (R$)</label>
              <input
                type="text"
                {...register("price", {
                  onChange: handlePriceChange, // Otimizado para integrar direto com o RHF
                })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500"
                placeholder="0,00"
              />
              {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Categoria</label>
                <button type="button" onClick={onOpenCategoryModal} className="text-xs font-bold text-emerald-700 hover:underline">+ Nova</button>
              </div>
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => {
                  const selectedCategoryName = categories.find(
                    (cat) => cat.id === field.value
                  )?.name;

                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full rounded-xl border border-slate-200 bg-white px-3 py-5 text-sm text-slate-900">
                        <SelectValue placeholder="Selecione...">
                          {selectedCategoryName || "Selecione..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.category_id && <p className="mt-1 text-xs text-rose-600">{errors.category_id.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Foto do prato</label>
            
            {imagePreview && (
              <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <Image
                  src={imagePreview}
                  alt="Preview da imagem"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition">
                {imagePreview ? "Trocar imagem" : "Selecionar imagem"}
                <input type="file" accept="image/*" {...register("image")} className="hidden" />
              </label>
            </div>
            {errors.image && <p className="mt-1 text-xs text-rose-600">{errors.image.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 px-4 text-xs font-semibold text-slate-700">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-10 px-5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white">
              {isSubmitting ? "Salvando..." : editingItem ? "Salvar Alterações" : "Criar Prato"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}