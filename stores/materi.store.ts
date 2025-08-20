import { create } from "zustand";
import { logger } from "../middleware/logger";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface MateriStore {
  data: any[];
  loading: boolean;
  pagination: PaginationInfo;
  highlightedId: string | null;
  selectedMateri: any | null;

  // Actions
  fetchData: (page?: number, filters?: any) => Promise<void>;
  setCurrentPage: (page: number) => void;
  viewMateri: (id: string) => void;
  setSelectedMateri: (materi: any | null) => void;
  refreshData: () => Promise<void>;
}

export const useMateri = create<MateriStore>()(
  logger((set, get) => ({
    data: [],
    loading: true,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
      startIndex: 0,
      endIndex: 0,
    },
    highlightedId: null,
    selectedMateri: null,

    fetchData: async (page = 1, filters = {}) => {
      set({ loading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) throw new Error("Token tidak ditemukan");

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...Object.fromEntries(
            Object.entries(filters).filter(
              ([_, value]) =>
                value !== undefined && value !== null && value !== ""
            )
          ),
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materi?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        console.log("🔍 Paginated API Response:", result);

        set({
          data: result.data || [],
          pagination: result.pagination || get().pagination,
          loading: false,
        });
      } catch (error) {
        console.error(error);
        set({ loading: false });
      }
    },

    setCurrentPage: (page) => {
      const { pagination } = get();
      set({
        pagination: { ...pagination, currentPage: page },
      });
    },

    viewMateri: (id) => set({ highlightedId: id }),

    setSelectedMateri: (materi) => {
      console.log("🔄 Setting selectedMateri:", materi);
      set({ selectedMateri: materi });
    },

    refreshData: async () => {
      const { pagination } = get();
      return get().fetchData(pagination.currentPage);
    },
  }))
);
