"use client";

import type { Category, MenuItem } from "../types/dashboard-types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  categories: Category[];
  menuItems: MenuItem[];
  onToggleAvailability: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
};

export function ProductsTab({
  categories,
  menuItems,
  onToggleAvailability,
  onEdit,
  onDelete,
}: Props) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Sem categoria";
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Sem categoria";
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Pratos Cadastrados</h2>
          <p className="text-xs sm:text-sm text-slate-600">Gerencie os itens do seu cardápio digital.</p>
        </div>
      </div>

      {menuItems.length === 0 ? (
        <div className="py-12 text-center text-xs sm:text-sm text-slate-500">
          Nenhum prato cadastrado ainda. Clique em &quot;+ Novo Prato&quot; acima.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-sm"
            >
              <div>
                {item.image_url ? (
                  <div className="relative mb-3 h-36 sm:h-40 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      priority={index === 0}
                      // Adicionado fetchPriority para forçar prioridade máxima no LCP detectado pelo Lighthouse
                      {...(index === 0 ? { fetchPriority: "high" } : {})}
                      quality={80}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-3 flex h-36 sm:h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500 font-medium">
                    Sem imagem
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h3>
                  <span className="font-bold text-emerald-700 text-sm">
                    R$ {Number(item.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <p className="mt-0.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {getCategoryName(item.category_id)}
                </p>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {item.description || "Sem descrição."}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleAvailability(item.id)}
                  className={`rounded-xl px-3 h-8 text-xs font-semibold ${
                    item.is_available
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {item.is_available ? "Disponível" : "Oculto"}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="rounded-xl px-3 h-8 text-xs font-semibold border-slate-200 text-slate-800 hover:bg-slate-50"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="rounded-xl px-3 h-8 text-xs font-semibold text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}