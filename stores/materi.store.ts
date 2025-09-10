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
    // Track last requested query to avoid duplicate requests
    _lastQueryKey: "",
    _inFlight: false,
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
      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) =>
          value !== undefined && value !== null && value !== ""
        )
      );
      const queryKey = JSON.stringify({ page, limit: 10, ...sanitizedFilters });

      // Prevent duplicate in-flight requests with identical parameters
      const { _inFlight, _lastQueryKey } = get() as any;
      if (_inFlight && _lastQueryKey === queryKey) {
        return;
      }

      set({ loading: true } as any);
      (set as any)({ _inFlight: true, _lastQueryKey: queryKey });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) throw new Error("Token tidak ditemukan");

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...sanitizedFilters,
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

        set({
          data: result.data || [],
          pagination: result.pagination || get().pagination,
          loading: false,
        } as any);
      } catch (error) {
        console.error(error);
        set({ loading: false } as any);
      }
      (set as any)({ _inFlight: false });
    },

    setCurrentPage: (page) => {
      const { pagination } = get();
      set({
        pagination: { ...pagination, currentPage: page },
      });
    },

    viewMateri: (id) => set({ highlightedId: id }),

    setSelectedMateri: (materi) => {
      set({ selectedMateri: materi });
    },

    refreshData: async () => {
      const { pagination } = get();
      return get().fetchData(pagination.currentPage);
    },
  }))
);
