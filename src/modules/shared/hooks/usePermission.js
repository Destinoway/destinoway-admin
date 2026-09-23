"use client";

import { useAuthStore } from "@/modules/auth/store/auth.store";

export const usePermission = (module) => {
  const { permissions = {}, user } = useAuthStore();

  const isAdmin =
    user?.role === "admin" || user?.type === "admin" || user?.isSystemRole;

  const check = (action = "read") => {
    if (isAdmin) return true;
    return !!permissions?.[module]?.[action];
  };

  const canAccessModule = () => {
    if (isAdmin) return true;
    const modulePerm = permissions?.[module];
    if (!modulePerm) return false;
    return Object.values(modulePerm).some(Boolean);
  };

  return {
    canRead: check("read"),
    canCreate: check("write"),
    canEdit: check("update"),
    canDelete: check("delete"),

    can: check, // dynamic use
    canAccessModule: canAccessModule(),

    isAdmin,
  };
};
