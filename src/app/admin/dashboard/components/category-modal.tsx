"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";

const schema = yup.object({
  name: yup.string().required("O nome da categoria é obrigatório"),
});

type CategoryFormData = { name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
};

export function CategoryModal({ isOpen, onClose, onSubmit, isSubmitting, error }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Nova Categoria</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs sm:text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(async (data) => { await onSubmit(data.name); reset(); })} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nome da categoria</label>
            <input {...register("name")} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500" placeholder="Ex: Bebidas, Sobremesas..." />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 px-4 text-xs font-semibold text-slate-700">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-10 px-5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white">
              {isSubmitting ? "Salvando..." : "Salvar Categoria"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}