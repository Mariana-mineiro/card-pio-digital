"use client";

import {
  getHomeCategories,
  getHomeMenuItems,
  getHomeSettings,
} from "@/app/services/home-service";
import type { Category, MenuItem, Settings } from "@/app/types/home-types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useHome() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [settingsData, categoriesData, itemsData] = await Promise.all([
        getHomeSettings(),
        getHomeCategories(),
        getHomeMenuItems(),
      ]);

      setSettings(settingsData);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao carregar o cardápio.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadHomeData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadHomeData]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return menuItems;
    return menuItems.filter((item) => item.category_id === activeCategory);
  }, [activeCategory, menuItems]);

  return {
    settings,
    categories,
    menuItems,
    filteredItems,
    activeCategory,
    setActiveCategory,
    isLoading,
    error,
    reload: loadHomeData,
  };
}