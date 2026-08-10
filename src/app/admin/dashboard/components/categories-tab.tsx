"use client";

import type { Category } from "../types/dashboard-types";
import { Button } from "@/components/ui/button";

type Props = {
  categories: Category[];
  onDeleteCategory: (id: string) => void;
};

export function CategoriesTab({ categories, onDeleteCategory }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Categorias Cadastradas</h2>
          <p className="text-xs sm:text-sm text-slate-500">Organize os grupos do seu cardápio.</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="py-12 text-center text-xs sm:text-sm text-slate-500">
          Nenhuma categoria cadastrada ainda. Clique em &quot;+ Nova Categoria&quot; acima.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 mt-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{category.name}</h3>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteCategory(category.id)}
                className="rounded-xl px-3 h-8 text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Excluir
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}