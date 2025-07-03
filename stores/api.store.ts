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
      set({ jenisLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch("http://localhost:5000/api/jenis", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
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
      set({ fiturLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch("http://localhost:5000/api/fitur", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
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
      set({ brandsLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch("http://localhost:5000/api/brands", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
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
      set({ clustersLoading: true });
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        const response = await fetch("http://localhost:5000/api/clusters", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
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
      
      await Promise.all([
        fetchJenis(),
        fetchFitur(),
        fetchBrands(),
        fetchClusters()
      ]);
    },
  }))
);