import { create } from "zustand";
import { logger } from "../middleware/logger";

interface MateriStore {
  data: any[];
  stats: any;
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  total: number;
  highlightedId: number | null;
  selectedMateri: any;
  fetchPaginatedData: (page?: number, filters?: any) => Promise<void>;
  fetchWithStats: (page?: number, filters?: any) => Promise<void>;
  setCurrentPage: (page: number) => void;
  viewMateri: (id: any) => void;
  setSelectedMateri: (materi: any) => void;
}

export const useMateri = create<MateriStore>()(
  logger((set, get) => ({
    data: [],
    stats: {},
    loading: true,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    total: 0,
    highlightedId: null,
    selectedMateri: null,

    fetchPaginatedData: async (page?: number, filters?: any) => {
      const currentPage = page || get().currentPage;
      const { itemsPerPage } = get();

      set({ loading: true });

      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) throw new Error("Token tidak ditemukan");

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(filters || {}),
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

    fetchWithStats: async (page?: number, filters?: any) => {
      const currentPage = page || get().currentPage;
      const { itemsPerPage } = get();

      set({ loading: true });

      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) throw new Error("Token tidak ditemukan");

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(filters || {}),
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materi/with-stats?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        set({
          data: result.data,
          stats: result.stats,
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
    },

    viewMateri: (id) => set({ highlightedId: id }),

    setSelectedMateri: (materi) => {
      set({ selectedMateri: materi });
    },
  }))
);
