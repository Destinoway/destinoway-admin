import { create } from "zustand";

export const useLoaderStore = create((set) => ({
  loading: false,

  start: () => set({ loading: true }),
  stop: () => set({ loading: false }),
}));