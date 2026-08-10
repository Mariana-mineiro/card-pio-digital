"use client";

import { CategoriesTab } from "@/app/admin/dashboard/components/categories-tab";
import { ProductsTab } from "@/app/admin/dashboard/components/products-tab";
import { ProductModal } from "@/app/admin/dashboard/components/product-modal";
import { CategoryModal } from "@/app/admin/dashboard/components/category-modal";
import { ConfirmModal } from "@/app/admin/dashboard/components/confirm-modal";
import { useDashboard } from "@/app/admin/dashboard/hooks/use-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-8 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-6">
        {/* Cabeçalho */}
        <header className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
                Painel administrativo
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
                Gerencie o seu cardápio
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant={dashboard.settings?.is_open ? "default" : "secondary"}
                onClick={() => void dashboard.toggleRestaurantStatus()}
                className={`rounded-full px-4 h-9 text-xs font-bold transition ${
                  dashboard.settings?.is_open
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                }`}
              >
                {dashboard.settings?.is_open ? "Aberto agora" : "Fechado agora"}
              </Button>
              <Button
                onClick={dashboard.openCreateProductModal}
                className="rounded-full bg-emerald-600 px-4 h-9 text-xs font-bold text-white hover:bg-emerald-700"
              >
                + Novo Prato
              </Button>
              <Button
                variant="outline"
                onClick={() => dashboard.setIsCategoryModalOpen(true)}
                className="rounded-full px-4 h-9 text-xs font-bold border-slate-200 hover:bg-slate-50"
              >
                + Categoria
              </Button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 h-9 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Ver cardápio
              </Link>
            </div>
          </div>
        </header>

        {/* Skeleton de Carregamento Global */}
        {dashboard.isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 w-full rounded-2xl bg-slate-200" />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="h-6 w-40 rounded-md bg-slate-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-2xl bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        ) : dashboard.error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center shadow-xs space-y-3">
            <p className="text-sm font-bold text-rose-900">{dashboard.error}</p>
            <Button
              onClick={() => void dashboard.reload()}
              className="rounded-full bg-rose-600 px-5 h-9 text-xs font-bold text-white hover:bg-rose-700"
            >
              Tentar novamente
            </Button>
          </section>
        ) : (
          <Tabs defaultValue="products" className="w-full space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-200/60 p-1">
              <TabsTrigger value="products" className="rounded-xl text-xs sm:text-sm font-bold">
                Pratos ({dashboard.menuItems.length})
              </TabsTrigger>
              <TabsTrigger value="categories" className="rounded-xl text-xs sm:text-sm font-bold">
                Categorias ({dashboard.categories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsTab
                categories={dashboard.categories}
                menuItems={dashboard.menuItems}
                onToggleAvailability={dashboard.toggleAvailability}
                onEdit={dashboard.openEditProductModal}
                onDelete={dashboard.requestDeleteMenuItem}
              />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesTab
                categories={dashboard.categories}
                onDeleteCategory={dashboard.requestDeleteCategory}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Modais */}
        <ProductModal
          isOpen={dashboard.isProductModalOpen}
          onClose={() => dashboard.setIsProductModalOpen(false)}
          categories={dashboard.categories}
          editingItem={dashboard.editingItem}
          onSubmit={dashboard.handleSaveMenuItem}
          isSubmitting={dashboard.isSubmitting}
          error={dashboard.modalError}
          onOpenCategoryModal={() => {
            dashboard.setIsProductModalOpen(false);
            dashboard.setIsCategoryModalOpen(true);
          }}
        />

        <CategoryModal
          isOpen={dashboard.isCategoryModalOpen}
          onClose={() => dashboard.setIsCategoryModalOpen(false)}
          onSubmit={dashboard.handleCreateCategory}
          isSubmitting={dashboard.isSubmitting}
          error={dashboard.modalError}
        />

        <ConfirmModal
          isOpen={dashboard.confirmConfig.isOpen}
          title={dashboard.confirmConfig.title}
          description={dashboard.confirmConfig.description}
          isSubmitting={dashboard.isSubmitting}
          onConfirm={dashboard.confirmConfig.onConfirm}
          onClose={() => dashboard.setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </main>
  );
}