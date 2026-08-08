"use client";

import {
  createDashboardCategory,
  createDashboardMenuItem,
  deleteDashboardMenuItem,
  getDashboardCategories,
  getDashboardMenuItems,
  getDashboardSettings,
  updateDashboardMenuItem,
  updateDashboardSettings,
} from "@/app/admin/dashboard/services/dashboard-service";
import type {
  Category,
  MenuItem,
  Settings,
} from "@/app/admin/dashboard/types/dashboard-types";
import { useCallback, useEffect, useMemo, useState } from "react";

type ProductDraft = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  is_available: boolean;
};

export function useDashboard() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draftCategory, setDraftCategory] = useState("");
  const [draftItem, setDraftItem] = useState<ProductDraft>({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
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
      setError(
        err instanceof Error ? err.message : "Falha ao carregar o dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadDashboardData]);

  const toggleRestaurantStatus = async () => {
    if (!settings) return;
    const updated = await updateDashboardSettings({
      ...settings,
      is_open: !settings.is_open,
    });
    setSettings(updated);
  };

  const addCategory = async () => {
    if (!draftCategory.trim()) return;
    const created = await createDashboardCategory(draftCategory.trim());
    setCategories((current) => [...current, created]);
    setDraftCategory("");
  };

  const addOrUpdateMenuItem = async () => {
    if (!draftItem.name.trim()) return;

    const payload = {
      name: draftItem.name.trim(),
      description: draftItem.description.trim(),
      price: Number(draftItem.price || 0),
      category_id: draftItem.category_id || undefined,
      is_available: draftItem.is_available,
    };

    if (editingItemId) {
      const updated = await updateDashboardMenuItem(editingItemId, payload);
      setMenuItems((current) =>
        current.map((item) => (item.id === editingItemId ? updated : item)),
      );
      setEditingItemId(null);
    } else {
      const created = await createDashboardMenuItem(payload);
      setMenuItems((current) => [created, ...current]);
    }

    setDraftItem({
      name: "",
      description: "",
      price: "",
      category_id: "",
      is_available: true,
    });
  };

  const startEditingItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setDraftItem({
      name: item.name,
      description: item.description ?? "",
      price: String(item.price),
      category_id: item.category_id ?? "",
      is_available: item.is_available,
    });
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
    setDraftItem({
      name: "",
      description: "",
      price: "",
      category_id: "",
      is_available: true,
    });
  };

  const toggleAvailability = async (id: string) => {
    const item = menuItems.find((entry) => entry.id === id);
    if (!item) return;
    const updated = await updateDashboardMenuItem(id, {
      is_available: !item.is_available,
    });
    setMenuItems((current) =>
      current.map((entry) => (entry.id === id ? updated : entry)),
    );
  };

  const deleteMenuItem = async (id: string) => {
    await deleteDashboardMenuItem(id);
    setMenuItems((current) => current.filter((item) => item.id !== id));
  };

  const summary = useMemo(
    () => ({
      totalItems: menuItems.length,
      availableItems: menuItems.filter((item) => item.is_available).length,
      unavailableItems: menuItems.filter((item) => !item.is_available).length,
      categoriesCount: categories.length,
    }),
    [categories.length, menuItems],
  );

  return {
    settings,
    categories,
    menuItems,
    isLoading,
    error,
    draftCategory,
    draftItem,
    editingItemId,
    setDraftCategory,
    setDraftItem,
    toggleRestaurantStatus,
    addCategory,
    addOrUpdateMenuItem,
    startEditingItem,
    cancelEditingItem,
    toggleAvailability,
    deleteMenuItem,
    summary,
    reload: loadDashboardData,
  };
}
