import { create } from "zustand";
import { logger } from "../middleware/logger";

interface Jenis {
  id: number;
  name: string;
}

interface Fitur {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Cluster {
  id: number;
  name: string;
}

interface MultiApiStore {
  jenis: Jenis[];
  fitur: Fitur[];
  brands: Brand[];
  clusters: Cluster[];

  jenisLoading: boolean;
  fiturLoading: boolean;
  brandsLoading: boolean;
  clustersLoading: boolean;

  fetchJenis: () => Promise<void>;
  fetchFitur: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchClusters: () => Promise<void>;
  fetchAllData: () => Promise<void>;
}

export const useMultiApiStore = create<MultiApiStore>()(
  logger((set, get) => ({
    jenis: [],
    fitur: [],
    brands: [],
    clusters: [],

    jenisLoading: false,
    fiturLoading: false,
    brandsLoading: false,
    clustersLoading: false,

    fetchJenis: async () => {
      set({ jenisLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jenis`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data jenis");

        const result = await response.json();
        set({ jenis: result, jenisLoading: false });
      } catch (error) {
        console.error("Error fetching jenis:", error);
        set({ jenisLoading: false });
      }
    },

    fetchFitur: async () => {
      set({ fiturLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/fitur`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data fitur");

        const result = await response.json();
        set({ fitur: result, fiturLoading: false });
      } catch (error) {
        console.error("Error fetching fitur:", error);
        set({ fiturLoading: false });
      }
    },

    fetchBrands: async () => {
      set({ brandsLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/brands`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data brands");

        const result = await response.json();
        set({ brands: result, brandsLoading: false });
      } catch (error) {
        console.error("Error fetching brands:", error);
        set({ brandsLoading: false });
      }
    },

    fetchClusters: async () => {
      set({ clustersLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/clusters`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data clusters");

        const result = await response.json();
        set({ clusters: result, clustersLoading: false });
      } catch (error) {
        console.error("Error fetching clusters:", error);
        set({ clustersLoading: false });
      }
    },

    fetchAllData: async () => {
      const { fetchJenis, fetchFitur, fetchBrands, fetchClusters } = get();

      await Promise.all([
        fetchJenis(),
        fetchFitur(),
        fetchBrands(),
        fetchClusters(),
      ]);
    },
  }))
);
