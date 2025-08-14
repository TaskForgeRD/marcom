import { create } from "zustand";
import { logger } from "../middleware/logger";

interface MateriStore {
  data: any[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  total: number;
  highlightedId: number | null;
  selectedMateri: any;
  currentFilters: any; // ✅ Tambah state untuk menyimpan filter
  fetchPaginatedData: (page?: number, filters?: any) => Promise<void>;
  setCurrentPage: (page: number) => void;
  viewMateri: (id: number) => void;
  setSelectedMateri: (materi: any) => void;
}

export const useMateri = create<MateriStore>()(
  logger((set, get) => ({
    data: [],
    loading: true,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    total: 0,
    highlightedId: null,
    selectedMateri: null,
    currentFilters: {}, // ✅ Inisialisasi filter

    fetchPaginatedData: async (page?: number, filters?: any) => {
      const currentPage = page || get().currentPage;
      const { itemsPerPage, currentFilters } = get();

      // ✅ Gunakan filter yang diberikan atau filter yang tersimpan
      const activeFilters = filters || currentFilters;

      set({ loading: true, currentFilters: activeFilters }); // ✅ Simpan filter

      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) throw new Error("Token tidak ditemukan");

        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...activeFilters, // ✅ Gunakan filter yang aktif
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materi?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        console.log("🔍 RAW API Response:", result);

        set({
          data: result.data,
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.page,
          loading: false,
        });
      } catch (error) {
        console.error(error);
        set({ loading: false });
      }
    },

    setCurrentPage: (page) => {
      set({ currentPage: page });
      // ✅ Tidak perlu parameter kedua karena filter sudah tersimpan di state
      get().fetchPaginatedData(page);
    },

    viewMateri: (id) => set({ highlightedId: id }),

    setSelectedMateri: (materi) => {
      console.log("🔄 Setting selectedMateri:", materi);
      set({ selectedMateri: materi });
    },
  }))
);
