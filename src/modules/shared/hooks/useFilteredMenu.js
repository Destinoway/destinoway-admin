"use client";

import { bottomMenuItems } from "@/config/bottomMenuConfig";
import { menuItems } from "@/config/menuConfig";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const filterMenus = (items, canAccessModule) => {
  return items
    .map((item) => {
      // Logout ko filter mat karo
      if (item.key === "logout") {
        return item;
      }

      if (item.children) {
        const children = item.children.filter((child) =>
          canAccessModule(child.module),
        );

        if (children.length > 0) {
          return {
            ...item,
            children,
          };
        }

        return null;
      }

      return canAccessModule(item.module) ? item : null;
    })
    .filter(Boolean);
};

export const useFilteredMenu = () => {
  const { permissions = {}, user } = useAuthStore();

  const isAdmin =
    user?.role === "admin" || user?.type === "admin" || user?.isSystemRole;

  const canAccessModule = (module) => {
    if (isAdmin) return true;

    return !!permissions?.[module]?.read;
  };

  return {
    menuItems: filterMenus(menuItems, canAccessModule),
    bottomMenuItems: filterMenus(bottomMenuItems, canAccessModule),
  };
};
