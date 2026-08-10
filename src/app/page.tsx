"use client";

import { useHome } from "@/app/hooks/use-home";
import { useState } from "react";
import type { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

type MenuItem = Tables<"menu_items">;

export default function HomePage() {
  const {
    settings,
    categories,
    filteredItems,
    activeCategory,
    isLoading,
    error,
    setActiveCategory,
    reload,
  } = useHome();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 pb-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Cabeçalho do Estabelecimento */}
        <header className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
                Cardápio Digital
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Rancho Mineiro
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Confira nossos pratos do dia preparados com muito carinho e ingredientes frescos.
              </p>
            </div>

            {/* Status Aberto / Fechado */}
            <div className="self-start sm:self-auto">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm ${
                  settings?.is_open
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    settings?.is_open ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                {settings?.is_open ? "Aberto agora" : "Fechado agora"}
              </span>
            </div>
          </div>
        </header>

        {/* Estado de Carregamento (Skeleton Bonito) */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            {/* Skeleton da Nav de Categorias */}
            <div className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm border border-stone-200">
              <div className="h-9 w-20 rounded-full bg-stone-200 shrink-0" />
              <div className="h-9 w-24 rounded-full bg-stone-200 shrink-0" />
              <div className="h-9 w-28 rounded-full bg-stone-200 shrink-0" />
              <div className="h-9 w-22 rounded-full bg-stone-200 shrink-0" />
            </div>

            {/* Skeleton da Listagem de Pratos */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="h-20 w-20 shrink-0 rounded-2xl bg-stone-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-2/5 rounded-md bg-stone-200" />
                    <div className="h-4 w-4/5 rounded-md bg-stone-100" />
                  </div>
                  <div className="h-5 w-16 rounded-md bg-stone-200 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xl font-bold">
              ⚠️
            </div>
            <div>
              <p className="font-bold text-rose-900 text-base">Ops! Ocorreu um problema ao carregar o cardápio.</p>
              <p className="text-xs text-rose-700 mt-1 opacity-90">{error}</p>
            </div>
            <button
              onClick={() => void reload()}
              className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-rose-700 transition"
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            {/* Navegação por Categorias (Abas) */}
            <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm border border-stone-200 no-scrollbar sticky top-4 z-10">
              <button
                onClick={() => setActiveCategory("all")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    activeCategory === category.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>

            {/* Listagem de Pratos */}
            <section className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                  Nenhum prato disponível nesta categoria no momento.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => setSelectedItem(item as MenuItem)}
                    className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-slate-300 active:scale-[0.99] cursor-pointer sm:p-5"
                  >
                    {/* Imagem do Prato */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden text-2xl">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>🍽️</span>
                      )}
                    </div>

                    {/* Informações do Prato */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-base font-bold text-slate-900 truncate">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">
                            {item.description || "Sem descrição informada."}
                          </p>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900 whitespace-nowrap">
                          R$ {Number(item.price).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </div>

      {/* Drawer de Detalhes do Prato */}
      <Drawer
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        showSwipeHandle={isMobile}
        swipeDirection={isMobile ? "down" : "right"}
      >
        <DrawerContent>
          {selectedItem && (
            <>
              {selectedItem.image_url && (
                <div className="h-48 w-full bg-stone-100 relative shrink-0">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <DrawerHeader>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Detalhes do Prato
                  </span>
                  <DrawerTitle className="text-2xl font-black text-slate-900">
                    {selectedItem.name}
                  </DrawerTitle>
                  <div className="pt-1">
                    <span className="inline-block text-lg font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                      R$ {Number(selectedItem.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
                <DrawerDescription className="sr-only">
                  Detalhes e descrição do prato selecionado
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex-1 scroll-fade overflow-y-auto px-6 py-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Descrição Completa
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {selectedItem.description || "Nenhuma descrição detalhada informada para este prato."}
                  </p>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose render={<Button variant="outline" className="w-full">Fechar</Button>} />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </main>
  );
}