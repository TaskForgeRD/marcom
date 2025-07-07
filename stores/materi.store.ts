import { create } from "zustand";
import { logger } from "../middleware/logger";
import { MateriStore } from "../types/materi";

export const useMateri = create<MateriStore>()(
  logger((set) => ({
    data: [],
    loading: true,
    currentPage: 1,
    itemsPerPage: 10,
    highlightedId: null,
    fetchData: async () => {
      set({ loading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) throw new Error("Token tidak ditemukan");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materi`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();

        console.log("🔍 RAW API Response:", result[0]);

        set({ data: result.reverse(), loading: false });
      } catch (error) {
        console.error(error);
        set({ loading: false });
      }
    },
    setCurrentPage: (page) => set({ currentPage: page }),
    viewMateri: (id) => set({ highlightedId: id }),
    selectedMateri: null,
    setSelectedMateri: (materi) => {
      console.log("🔄 Setting selectedMateri:", materi);
      set({ selectedMateri: materi });
    },
  }))
);
