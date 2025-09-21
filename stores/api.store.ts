import { create } from "zustand";
import { logger } from "../middleware/logger";

// Types untuk setiap data
interface Jenis {
  id: number;
  name: string;
  // tambahkan properti lain sesuai struktur data API
}

interface Fitur {
  id: number;
  name: string;
  // tambahkan properti lain sesuai struktur data API
}

interface Brand {
  id: number;
  name: string;
  // tambahkan properti lain sesuai struktur data API
}

interface Cluster {
  id: number;
  name: string;
  // tambahkan properti lain sesuai struktur data API
}

interface MultiApiStore {
  // Data states
  jenis: Jenis[];
  fitur: Fitur[];
  brands: Brand[];
  clusters: Cluster[];

  // Loading states
  jenisLoading: boolean;
  fiturLoading: boolean;
  brandsLoading: boolean;
  clustersLoading: boolean;

  // Actions
  fetchJenis: () => Promise<void>;
  fetchFitur: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchClusters: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

export const useMultiApiStore = create<MultiApiStore>()(
  logger((set, get) => ({
    // Initial states
    jenis: [],
    fitur: [],
    brands: [],
    clusters: [],

    jenisLoading: false,
    fiturLoading: false,
    brandsLoading: false,
    clustersLoading: false,

    // Fetch Jenis
    fetchJenis: async () => {
      const { jenisLoading, jenis } = get();
      if (jenisLoading || jenis.length > 0) return; // Prevent duplicate calls or if data exists
      
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

    // Fetch Fitur
    fetchFitur: async () => {
      const { fiturLoading, fitur } = get();
      if (fiturLoading || fitur.length > 0) return; // Prevent duplicate calls or if data exists
      
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

    // Fetch Brands
    fetchBrands: async () => {
      const { brandsLoading, brands } = get();
      if (brandsLoading || brands.length > 0) return; // Prevent duplicate calls or if data exists
      
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

    // Fetch Clusters
    fetchClusters: async () => {
      const { clustersLoading, clusters } = get();
      if (clustersLoading || clusters.length > 0) return; // Prevent duplicate calls or if data exists
      
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

    // Fetch semua data sekaligus
    fetchAllData: async () => {
      const { fetchJenis, fetchFitur, fetchBrands, fetchClusters } = get();

      // Only fetch data that doesn't exist yet
      const promises = [];
      const { jenis, fitur, brands, clusters } = get();
      
      if (jenis.length === 0) promises.push(fetchJenis());
      if (fitur.length === 0) promises.push(fetchFitur());
      if (brands.length === 0) promises.push(fetchBrands());
      if (clusters.length === 0) promises.push(fetchClusters());

      await Promise.all(promises);
    },

    // Force refresh all data (ignore existing data)
    refreshAllData: async () => {
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
