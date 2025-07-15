import { create } from "zustand";
import { logger } from "../middleware/logger";
import { FilterStore } from "../types/filterMateri";

export const useFilterStore = create<FilterStore>()(
  logger((set) => ({
    filters: {},
    tempFilters: {},
    searchQuery: "",
    selectedPreset: "All time",
    onlyVisualDocs: false, // Tambahkan state untuk filter Key Visual
    setTempFilter: (key, value) =>
      set((state) => ({ tempFilters: { ...state.tempFilters, [key]: value } })),
    applyFilters: () => set((state) => ({ filters: state.tempFilters })),
    resetFilters: () =>
      set({
        filters: {},
        tempFilters: {},
        searchQuery: "",
        onlyVisualDocs: false, // Reset filter Key Visual
      }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedPreset: (preset) => set({ selectedPreset: preset }),
    setOnlyVisualDocs: (value: any) => set({ onlyVisualDocs: value }), // Tambahkan setter untuk filter Key Visual
  }))
);
