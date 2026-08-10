"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import Image from "next/image";

import { useHome } from "@/app/hooks/use-home";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tables } from "@/types/supabase";

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
    <main className="min-h-screen bg-[oklch(0.985_0.002_85)] text-slate-900 pb-16">
      
      {/* Faixa Superior com a Cor de Fundo Aconchegante (Estilo Referência) */}
      <div className="w-full bg-[oklch(0.91_0.03_85)] h-44 sm:h-52 relative" />

      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10">
        
        {/* Cabeçalho Estilo Lovable com Logo Sobreposta */}
        <header className="relative rounded-3xl border border-stone-200/80 bg-white px-6 pb-6 pt-16 text-center shadow-lg sm:px-8 sm:pb-8 sm:pt-20">
          {/* Logo Circular Sobreposta */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-white bg-white shadow-md flex items-center justify-center">
            <Image
              src="/logo-rancho-mineiro.png"
              alt="Logo Rancho Mineiro"
              width={112}
              height={112}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          {/* Informações do Estabelecimento */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Rancho Mineiro
              </h1>
              
              {/* Status Aberto / Fechado */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                  settings?.is_open
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    settings?.is_open ? "bg-emerald-200 animate-pulse" : "bg-amber-200"
                  }`}
                />
                {settings?.is_open ? "Aberto" : "Fechado"}
              </span>
            </div>

            <p className="max-w-md text-sm sm:text-base leading-relaxed text-stone-600 font-medium">
              Restaurante e Pesque e Pague • Pratos do dia preparados com ingredientes frescos e muito carinho!
            </p>
          </div>
        </header>

        {/* Estado de Carregamento (Skeleton) */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse pt-2">
            <div className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-xs border border-stone-200">
              <div className="h-9 w-20 rounded-full bg-stone-200 shrink-0" />
              <div className="h-9 w-24 rounded-full bg-stone-200 shrink-0" />
              <div className="h-9 w-28 rounded-full bg-stone-200 shrink-0" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-xs sm:p-5"
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
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center shadow-xs space-y-4 pt-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xl font-bold">
              ⚠️
            </div>
            <div>
              <p className="font-bold text-rose-900 text-base">
                Ops! Ocorreu um problema ao carregar o cardápio.
              </p>
              <p className="text-xs text-rose-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => void reload()}
              className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-rose-700 transition"
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            {/* Navegação por Categorias (Abas) */}
            <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm border border-stone-200 no-scrollbar sticky top-4 z-20">
              <button
                onClick={() => setActiveCategory("all")}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === "all"
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
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
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>

            {/* Listagem de Pratos */}
            <section className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-600 shadow-xs">
                  Nenhum prato disponível nesta categoria no momento.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => setSelectedItem(item as MenuItem)}
                    className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 active:scale-[0.99] cursor-pointer sm:p-5"
                  >
                    {/* Imagem do Prato */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden text-2xl">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={80}
                          height={80}
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
                          <h2 className="text-base font-bold text-stone-900 truncate">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-xs leading-relaxed text-stone-600 line-clamp-2">
                            {item.description || "Sem descrição informada."}
                          </p>
                        </div>
                        <span className="text-sm font-black text-emerald-700 whitespace-nowrap">
                          R$ {Number(item.price).toFixed(2).replace(".", ",")}
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
                <div className="mx-auto mt-4 w-40 h-40 sm:w-48 sm:h-48 bg-stone-100 relative shrink-0 overflow-hidden rounded-2xl shadow-md border border-stone-200">
                  <Image
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    width={200}
                    height={200}
                    sizes="(max-width: 768px) 160px, 192px"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <DrawerHeader className="text-center sm:text-left">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Detalhes do Prato
                  </span>
                  <DrawerTitle className="text-2xl font-black text-stone-900">
                    {selectedItem.name}
                  </DrawerTitle>
                  <div className="pt-1">
                    <span className="inline-block text-lg font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                      R$ {Number(selectedItem.price).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
                <DrawerDescription className="sr-only">
                  Detalhes e descrição do prato selecionado
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex-1 scroll-fade overflow-y-auto px-6 py-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Descrição Completa
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-800 font-medium whitespace-pre-wrap">
                    {selectedItem.description ||
                      "Nenhuma descrição detalhada informada para este prato."}
                  </p>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose
                  render={
                    <Button variant="outline" className="w-full rounded-2xl font-bold text-stone-800 border-stone-300">
                      Fechar
                    </Button>
                  }
                />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </main>
  );
}