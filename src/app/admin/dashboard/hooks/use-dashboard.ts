import {
  createDashboardCategory,
  createDashboardMenuItem,
  deleteDashboardCategory,
  deleteDashboardMenuItem,
  getDashboardCategories,
  getDashboardMenuItems,
  getDashboardSettings,
  updateDashboardCategory,
  updateDashboardMenuItem,
  updateDashboardSettings,
  uploadProductImage,
} from "@/app/admin/dashboard/services/dashboard-service";
import type {
  Category,
  MenuItem,
  ProductFormData,
  Settings,
} from "../types/dashboard-types";
import { useCallback, useEffect, useState } from "react";

export function useDashboard() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados dos Modais
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Estado do Modal de Confirmação Genérico
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const loadDashboardData = useCallback(async function fetchDashboard(retries = 3) {
    setIsLoading(true);
    setError(null);

    try {
      const [settingsData, categoriesData, itemsData] = await Promise.all([
        getDashboardSettings(),
        getDashboardCategories(),
        getDashboardMenuItems(),
      ]);

      setSettings(settingsData);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("JWT issued at future") && retries > 0) {
        setTimeout(() => {
          void fetchDashboard(retries - 1);
        }, 1000);
        return;
      }
      setError(message || "Falha ao carregar o dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadDashboardData]);

  const toggleRestaurantStatus = async () => {
    if (!settings) return;
    try {
      const updated = await updateDashboardSettings({
        ...settings,
        is_open: !settings.is_open,
      });
      setSettings(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (name: string) => {
    setIsSubmitting(true);
    setModalError(null);
    try {
      const created = await createDashboardCategory(name.trim());
      setCategories((current) => [...current, created]);
      setIsCategoryModalOpen(false);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro ao criar categoria.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMenuItem = async (data: ProductFormData, id?: string) => {
    setIsSubmitting(true);
    setModalError(null);
    try {
      let imageUrl = editingItem?.image_url || null;
      if (data.image && data.image.length > 0) {
        imageUrl = await uploadProductImage(data.image[0]);
      }

      const priceString = typeof data.price === "string" ? data.price : String(data.price ?? "");
      const rawPrice = Number(priceString.replace(/\./g, "").replace(",", "."));

      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        price: isNaN(rawPrice) ? 0 : rawPrice,
        position: 0,
        category_id: data.category_id || null,
        is_available: data.is_available,
        is_active: true,
        image_url: imageUrl,
      };

      if (id) {
        const updated = await updateDashboardMenuItem(id, payload);
        setMenuItems((current) =>
          current.map((item) => (item.id === id ? updated : item)),
        );
      } else {
        const created = await createDashboardMenuItem(payload);
        setMenuItems((current) => [created, ...current]);
      }

      setIsProductModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro ao salvar prato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateProductModal = () => {
    setEditingItem(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsProductModalOpen(true);
  };

  const toggleAvailability = (id: string) => {
    const item = menuItems.find((entry) => entry.id === id);
    if (!item) return;

    setConfirmConfig({
      isOpen: true,
      title: item.is_available ? "Ocultar Prato" : "Tornar Disponível",
      description: `Deseja realmente ${item.is_available ? "ocultar" : "exibir"} o prato "${item.name}" no cardápio?`,
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          const updated = await updateDashboardMenuItem(id, {
            is_available: !item.is_available,
          });
          setMenuItems((current) =>
            current.map((entry) => (entry.id === id ? updated : entry)),
          );
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const requestDeleteMenuItem = (id: string) => {
    const item = menuItems.find((entry) => entry.id === id);
    setConfirmConfig({
      isOpen: true,
      title: "Excluir Prato",
      description: `Tem certeza que deseja excluir permanentemente o prato "${item?.name ?? ""}"?`,
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await deleteDashboardMenuItem(id);
          setMenuItems((current) => current.filter((item) => item.id !== id));
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const requestDeleteCategory = (id: string) => {
    const category = categories.find((entry) => entry.id === id);
    setConfirmConfig({
      isOpen: true,
      title: "Excluir Categoria",
      description: `Tem certeza que deseja excluir a categoria "${category?.name ?? ""}"?`,
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await deleteDashboardCategory(id);
          setCategories((current) => current.filter((cat) => cat.id !== id));
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  return {
    settings,
    categories,
    menuItems,
    isLoading,
    error,
    isProductModalOpen,
    setIsProductModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingItem,
    isSubmitting,
    modalError,
    confirmConfig,
    setConfirmConfig,
    toggleRestaurantStatus,
    handleCreateCategory,
    handleSaveMenuItem,
    openCreateProductModal,
    openEditProductModal,
    toggleAvailability,
    requestDeleteMenuItem,
    requestDeleteCategory,
    reload: loadDashboardData,
  };
}