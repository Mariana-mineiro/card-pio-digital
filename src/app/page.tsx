"use client";

import { useHome } from "@/app/hooks/use-home";
import { useState } from "react";
// Importe ou defina o tipo MenuItem conforme o seu projeto
type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string | null;
  category_id?: string;
  is_available: boolean;
};

export default function HomePage() {
  const {
    settings,
    categories,
    filteredItems,
    activeCategory,
    isLoading,
    error,
    setActiveCategory,
  } = useHome();

  // Estado para controlar o modal de detalhes do prato
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 pb-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Cabeçalho do Estabelecimento */}
        <header className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          {/* Capa do Restaurante (caso exista) */}
          {settings?.cover_url && (
            <div className="h-32 w-full bg-stone-100 sm:h-44">
              <img
                src={settings.cover_url}
                alt="Capa do Restaurante"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Logo do Restaurante (caso exista) */}
                {settings?.logo_url && (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm sm:h-16 sm:w-16">
                    <img
                      src={settings.logo_url}
                      alt={settings?.name || "Rancho Mineiro"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
                    Cardápio Digital
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {settings?.name || "Rancho Mineiro"}
                  </h1>
                </div>
              </div>

              {/* Status Aberto / Fechado */}
              <div
                className={`rounded-full px-3.5 py-1 text-xs font-bold shrink-0 ${
                  settings?.is_open
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {settings?.is_open ? "Aberto agora" : "Fechado agora"}
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {settings?.description || "Uma experiência limpa, responsiva e pensada para mostrar os pratos do dia sem distrações."}
            </p>
          </div>
        </header>

        {/* Estado de Carregamento */}
        {isLoading ? (
          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <div className="h-9 w-20 animate-pulse rounded-full bg-stone-200 shrink-0" />
              <div className="h-9 w-24 animate-pulse rounded-full bg-stone-200 shrink-0" />
            </div>
            <div className="space-y-3 pt-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-stone-100 w-full"
                />
              ))}
            </div>
          </section>
        ) : error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-center text-sm font-medium text-rose-700 shadow-sm">
            <p className="font-semibold mb-1">Ops! Ocorreu um problema ao carregar o cardápio.</p>
            <p className="text-xs opacity-90">{error}</p>
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

                    {/* Informações do Prato com mais descrição visível */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-base font-bold text-slate-900 truncate">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-3">
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

      {/* Modal de Detalhes do Prato */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Imagem Grande no Modal (se houver) */}
            {selectedItem.image_url ? (
              <div className="h-56 w-full bg-stone-100 relative">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 h-9 w-9 flex items-center justify-center backdrop-blur-sm transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-full h-9 w-9 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Conteúdo Detalhado */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Detalhes do Prato
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedItem.name}
                </h2>
                <span className="inline-block mt-2 text-lg font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                  R$ {Number(selectedItem.price).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Descrição Completa
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {selectedItem.description || "Nenhuma descrição detalhada informada para este prato."}
                </p>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-sm hover:bg-slate-800 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}