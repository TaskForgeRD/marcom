import { create } from "zustand";
import { logger } from "../middleware/logger";
import { FilterStore } from "../types/filterMateri";

export const useFilterStore = create<FilterStore>()(
  logger((set, get) => ({
    filters: {},
    tempFilters: {},
    searchQuery: "",
    selectedPreset: "All time",
    onlyVisualDocs: false,

    setTempFilter: (key, value) =>
      set((state) => ({ tempFilters: { ...state.tempFilters, [key]: value } })),

    applyFilters: () => {
      const { tempFilters } = get();
      set({ filters: tempFilters });

      // Trigger data fetch with new filters
      // This will be called from components that use this store
      return tempFilters;
    },

    resetFilters: () => {
      set({
        filters: {},
        tempFilters: {},
        searchQuery: "",
        onlyVisualDocs: false,
      });

      // Return empty filters for immediate use
      return {};
    },

    setStatusQuery: (status: "Aktif" | "Expired") => {
      const currentFilters = get().filters;
      const newFilters = { ...currentFilters, status };
      set({ filters: newFilters });
      return newFilters;
    },

    setSearchQuery: (query) => {
      set({ searchQuery: query });
      // Auto-apply search without waiting for "Apply" button
      const currentFilters = get().filters;
      const newFilters = { ...currentFilters, search: query };
      set({ filters: newFilters });
      return newFilters;
    },

    setSelectedPreset: (preset) => set({ selectedPreset: preset }),

    setOnlyVisualDocs: (value) => {
      set({ onlyVisualDocs: value });
      // Auto-apply visual docs filter
      const currentFilters = get().filters;
      const newFilters = { ...currentFilters, onlyVisualDocs: value };
      set({ filters: newFilters });
      return newFilters;
    },

    // New helper to get current filters for API calls
    getCurrentFilters: () => {
      const { filters, searchQuery, onlyVisualDocs } = get();
      return {
        ...filters,
        search: searchQuery,
        onlyVisualDocs,
      };
    },
  }))
);
