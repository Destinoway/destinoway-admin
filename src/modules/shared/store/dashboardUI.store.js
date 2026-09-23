import { create } from "zustand";

export const useDashboardUIStore = create((set) => ({
  isScrollLocked: false,

  setScrollLocked: (locked) =>
    set({
      isScrollLocked: locked,
    }),
}));
