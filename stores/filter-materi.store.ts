import { create } from "zustand";
import { logger } from "../middleware/logger";
import { FilterStore } from "../types/filterMateri"; // Import tipe

export const useFilterStore = create<FilterStore>()(
  logger((set) => ({
    filters: {},
    tempFilters: {},
    searchQuery: "",
    selectedPreset: "All time",
    setTempFilter: (key, value) =>
      set((state) => ({ tempFilters: { ...state.tempFilters, [key]: value } })),
    applyFilters: () => set((state) => ({ filters: state.tempFilters })),
    resetFilters: () =>
      set({ filters: {}, tempFilters: {}, searchQuery: "" }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedPreset: (preset) => set({ selectedPreset: preset }),
  }))
);