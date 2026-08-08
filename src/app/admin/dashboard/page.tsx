"use client";

import { CategoriesTab } from "@/app/admin/dashboard/components/categories-tab";
import { ProductsTab } from "@/app/admin/dashboard/components/products-tab";
import { useDashboard } from "@/app/admin/dashboard/hooks/use-dashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const dashboard = useDashboard();

  useEffect(() => {
    const checkSession = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
      }
    };

    void checkSession();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
                Painel administrativo
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                Gerencie o seu cardápio
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Alternar status do restaurante, criar categorias e organizar
                pratos em uma estrutura modular.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void dashboard.toggleRestaurantStatus()}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${dashboard.settings?.is_open ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-slate-800 text-slate-100 hover:bg-slate-700"}`}
              >
                {dashboard.settings?.is_open ? "Aberto agora" : "Fechado agora"}
              </button>
              <Link
                href="/"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Ver cardápio
              </Link>
            </div>
          </div>
        </header>

        {dashboard.isLoading ? (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="h-5 w-32 animate-pulse rounded-full bg-slate-800" />
            <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-800/70" />
          </section>
        ) : dashboard.error ? (
          <section className="rounded-3xl border border-rose-800 bg-rose-950/40 p-6 text-sm text-rose-300">
            <p>{dashboard.error}</p>
            <button
              onClick={() => void dashboard.reload()}
              className="mt-4 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white"
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <CategoriesTab
                categories={dashboard.categories}
                draftCategory={dashboard.draftCategory}
                onDraftChange={dashboard.setDraftCategory}
                onCreateCategory={() => void dashboard.addCategory()}
              />

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <h2 className="text-xl font-semibold">Resumo</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Pratos</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {dashboard.summary.totalItems}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Disponíveis</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-400">
                      {dashboard.summary.availableItems}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Indisponíveis</p>
                    <p className="mt-2 text-2xl font-semibold text-amber-400">
                      {dashboard.summary.unavailableItems}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <ProductsTab
              categories={dashboard.categories}
              menuItems={dashboard.menuItems}
              draftItem={dashboard.draftItem}
              editingItemId={dashboard.editingItemId}
              onDraftChange={dashboard.setDraftItem}
              onSubmit={() => void dashboard.addOrUpdateMenuItem()}
              onEdit={dashboard.startEditingItem}
              onCancel={dashboard.cancelEditingItem}
              onToggleAvailability={(id) =>
                void dashboard.toggleAvailability(id)
              }
              onDelete={(id) => void dashboard.deleteMenuItem(id)}
            />
          </>
        )}
      </div>
    </main>
  );
}
