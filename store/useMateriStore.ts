import { create } from "zustand";
import { logger } from "../middleware/logger";
import { MateriStore } from "../types/materi"; 

export const useMateriStore = create<MateriStore>()(
  logger((set) => ({
    data: [],
    loading: true,
    currentPage: 1,
    itemsPerPage: 10,
    highlightedId: null,
    fetchData: async () => {
      set({ loading: true });
      try {
        const response = await fetch("https://api-marcom.arisjirat.com/api/materi");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
    
        // Tidak perlu manipulasi lagi karena sudah sesuai struktur
        set({ data: result.reverse(), loading: false });
      } catch (error) {
        console.error(error);
        set({ loading: false });
      }
    },
    setCurrentPage: (page) => set({ currentPage: page }),
    viewMateri: (id) => set({ highlightedId: id }),
    selectedMateri: null,
    setSelectedMateri: (materi) => set({ selectedMateri: materi }),
  }))
);