"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getHomeCategories,
  getHomeMenuItems,
  getHomeSettings,
} from "@/app/services/home-service";
import { useMemo, useState } from "react";

export function useHome() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["home-settings"],
    queryFn: getHomeSettings,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["home-categories"],
    queryFn: getHomeCategories,
  });

  const { data: menuItems = [], isLoading: isLoadingMenuItems, error: queryError } = useQuery({
    queryKey: ["home-menu-items"],
    queryFn: getHomeMenuItems,
  });

  const isLoading = isLoadingSettings || isLoadingCategories || isLoadingMenuItems;
  const error = queryError?.message || null;

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
    reload: () => {
      queryClient.invalidateQueries({ queryKey: ["home-settings"] });
      queryClient.invalidateQueries({ queryKey: ["home-categories"] });
      queryClient.invalidateQueries({ queryKey: ["home-menu-items"] });
    },
  };
}