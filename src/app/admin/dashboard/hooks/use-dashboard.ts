"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

export function useDashboard() {
  const queryClient = useQueryClient();

  // Queries do React Query
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["dashboard-settings"],
    queryFn: getDashboardSettings,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["dashboard-categories"],
    queryFn: getDashboardCategories,
  });

  const { data: menuItems = [], isLoading: isLoadingMenuItems, error: queryError } = useQuery({
    queryKey: ["dashboard-menu-items"],
    queryFn: getDashboardMenuItems,
  });

  const isLoading = isLoadingSettings || isLoadingCategories || isLoadingMenuItems;
  const error = queryError?.message || null;

  // Estados dos Modais
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
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

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: updateDashboardSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard-settings"] }),
  });

  const createCategoryMutation = useMutation({
    mutationFn: createDashboardCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      setIsCategoryModalOpen(false);
    },
  });

  const saveProductMutation = useMutation({
    mutationFn: async ({ data, id }: { data: ProductFormData; id?: string }) => {
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
        return await updateDashboardMenuItem(id, payload);
      } else {
        return await createDashboardMenuItem(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      setIsProductModalOpen(false);
      setEditingItem(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteDashboardMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteDashboardCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ id, is_available }: { id: string; is_available: boolean }) => {
      return await updateDashboardMenuItem(id, { is_available });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    },
  });

  // Handlers para ações da tela
  const toggleRestaurantStatus = async () => {
    if (!settings) return;
    try {
      await updateSettingsMutation.mutateAsync({
        ...settings,
        is_open: !settings.is_open,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (name: string) => {
    setModalError(null);
    try {
      await createCategoryMutation.mutateAsync(name.trim());
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro ao criar categoria.");
    }
  };

  const handleSaveMenuItem = async (data: ProductFormData, id?: string) => {
    setModalError(null);
    try {
      await saveProductMutation.mutateAsync({ data, id });
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro ao salvar prato.");
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
        await toggleAvailabilityMutation.mutateAsync({
          id,
          is_available: !item.is_available,
        });
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
        await deleteProductMutation.mutateAsync(id);
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
        await deleteCategoryMutation.mutateAsync(id);
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
    isSubmitting:
      updateSettingsMutation.isPending ||
      createCategoryMutation.isPending ||
      saveProductMutation.isPending ||
      deleteProductMutation.isPending ||
      deleteCategoryMutation.isPending ||
      toggleAvailabilityMutation.isPending,
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
    reload: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-settings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-menu-items"] });
    },
  };
}