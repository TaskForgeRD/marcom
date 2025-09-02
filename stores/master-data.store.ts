import { create } from "zustand";
import { logger } from "../middleware/logger";

// Types
interface MasterDataItem {
  id: number;
  name: string;
}

interface MasterDataStore {
  // Data states
  brands: MasterDataItem[];
  clusters: MasterDataItem[];
  fitur: MasterDataItem[];
  jenis: MasterDataItem[];

  // Loading states
  brandsLoading: boolean;
  clustersLoading: boolean;
  fiturLoading: boolean;
  jenisLoading: boolean;

  // Actions for Brands
  fetchBrands: () => Promise<void>;
  createBrand: (name: string) => Promise<void>;
  updateBrand: (id: number, name: string) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;

  // Actions for Clusters
  fetchClusters: () => Promise<void>;
  createCluster: (name: string) => Promise<void>;
  updateCluster: (id: number, name: string) => Promise<void>;
  deleteCluster: (id: number) => Promise<void>;

  // Actions for Fitur
  fetchFitur: () => Promise<void>;
  createFitur: (name: string) => Promise<void>;
  updateFitur: (id: number, name: string) => Promise<void>;
  deleteFitur: (id: number) => Promise<void>;

  // Actions for Jenis
  fetchJenis: () => Promise<void>;
  createJenis: (name: string) => Promise<void>;
  updateJenis: (id: number, name: string) => Promise<void>;
  deleteJenis: (id: number) => Promise<void>;

  // Utility actions
  fetchAllData: () => Promise<void>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const raw = localStorage.getItem("marcom-auth-store");
  return raw ? JSON.parse(raw)?.state?.token : null;
};

// Helper function for API requests with better error handling
const makeApiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = getAuthToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const config: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    config
  );

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Throw error with the message from backend
    throw new Error(
      responseData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return responseData;
};

export const useMasterDataStore = create<MasterDataStore>()(
  logger((set, get) => ({
    // Initial states
    brands: [],
    clusters: [],
    fitur: [],
    jenis: [],

    brandsLoading: false,
    clustersLoading: false,
    fiturLoading: false,
    jenisLoading: false,

    // ===== BRANDS ACTIONS =====
    fetchBrands: async () => {
      set({ brandsLoading: true });
      try {
        const result = await makeApiRequest("/brands");
        set({ brands: result, brandsLoading: false });
      } catch (error) {
        console.error("Error fetching brands:", error);
        set({ brandsLoading: false });
        throw error;
      }
    },

    createBrand: async (name: string) => {
      try {
        const result = await makeApiRequest("/brands", "POST", { name });
        if (result.success) {
          await get().fetchBrands(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal membuat brand");
        }
      } catch (error) {
        console.error("Error creating brand:", error);
        throw error;
      }
    },

    updateBrand: async (id: number, name: string) => {
      try {
        const result = await makeApiRequest(`/brands/${id}`, "PUT", { name });
        if (result.success) {
          await get().fetchBrands(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal memperbarui brand");
        }
      } catch (error) {
        console.error("Error updating brand:", error);
        throw error;
      }
    },

    deleteBrand: async (id: number) => {
      try {
        const result = await makeApiRequest(`/brands/${id}`, "DELETE");
        if (result.success) {
          await get().fetchBrands(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal menghapus brand");
        }
      } catch (error) {
        console.error("Error deleting brand:", error);
        throw error;
      }
    },

    // ===== CLUSTERS ACTIONS =====
    fetchClusters: async () => {
      set({ clustersLoading: true });
      try {
        const result = await makeApiRequest("/clusters");
        set({ clusters: result, clustersLoading: false });
      } catch (error) {
        console.error("Error fetching clusters:", error);
        set({ clustersLoading: false });
        throw error;
      }
    },

    createCluster: async (name: string) => {
      try {
        const result = await makeApiRequest("/clusters", "POST", { name });
        if (result.success) {
          await get().fetchClusters(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal membuat cluster");
        }
      } catch (error) {
        console.error("Error creating cluster:", error);
        throw error;
      }
    },

    updateCluster: async (id: number, name: string) => {
      try {
        const result = await makeApiRequest(`/clusters/${id}`, "PUT", { name });
        if (result.success) {
          await get().fetchClusters(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal memperbarui cluster");
        }
      } catch (error) {
        console.error("Error updating cluster:", error);
        throw error;
      }
    },

    deleteCluster: async (id: number) => {
      try {
        const result = await makeApiRequest(`/clusters/${id}`, "DELETE");
        if (result.success) {
          await get().fetchClusters(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal menghapus cluster");
        }
      } catch (error) {
        console.error("Error deleting cluster:", error);
        throw error;
      }
    },

    // ===== FITUR ACTIONS =====
    fetchFitur: async () => {
      set({ fiturLoading: true });
      try {
        const result = await makeApiRequest("/fitur");
        set({ fitur: result, fiturLoading: false });
      } catch (error) {
        console.error("Error fetching fitur:", error);
        set({ fiturLoading: false });
        throw error;
      }
    },

    createFitur: async (name: string) => {
      try {
        const result = await makeApiRequest("/fitur", "POST", { name });
        if (result.success) {
          await get().fetchFitur(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal membuat fitur");
        }
      } catch (error) {
        console.error("Error creating fitur:", error);
        throw error;
      }
    },

    updateFitur: async (id: number, name: string) => {
      try {
        const result = await makeApiRequest(`/fitur/${id}`, "PUT", { name });
        if (result.success) {
          await get().fetchFitur(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal memperbarui fitur");
        }
      } catch (error) {
        console.error("Error updating fitur:", error);
        throw error;
      }
    },

    deleteFitur: async (id: number) => {
      try {
        const result = await makeApiRequest(`/fitur/${id}`, "DELETE");
        if (result.success) {
          await get().fetchFitur(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal menghapus fitur");
        }
      } catch (error) {
        console.error("Error deleting fitur:", error);
        throw error;
      }
    },

    // ===== JENIS ACTIONS =====
    fetchJenis: async () => {
      set({ jenisLoading: true });
      try {
        const result = await makeApiRequest("/jenis");
        set({ jenis: result, jenisLoading: false });
      } catch (error) {
        console.error("Error fetching jenis:", error);
        set({ jenisLoading: false });
        throw error;
      }
    },

    createJenis: async (name: string) => {
      try {
        const result = await makeApiRequest("/jenis", "POST", { name });
        if (result.success) {
          await get().fetchJenis(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal membuat jenis");
        }
      } catch (error) {
        console.error("Error creating jenis:", error);
        throw error;
      }
    },

    updateJenis: async (id: number, name: string) => {
      try {
        const result = await makeApiRequest(`/jenis/${id}`, "PUT", { name });
        if (result.success) {
          await get().fetchJenis(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal memperbarui jenis");
        }
      } catch (error) {
        console.error("Error updating jenis:", error);
        throw error;
      }
    },

    deleteJenis: async (id: number) => {
      try {
        const result = await makeApiRequest(`/jenis/${id}`, "DELETE");
        if (result.success) {
          await get().fetchJenis(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal menghapus jenis");
        }
      } catch (error) {
        console.error("Error deleting jenis:", error);
        throw error;
      }
    },

    // ===== UTILITY ACTIONS =====
    fetchAllData: async () => {
      const { fetchBrands, fetchClusters, fetchFitur, fetchJenis } = get();

      await Promise.allSettled([
        fetchBrands(),
        fetchClusters(),
        fetchFitur(),
        fetchJenis(),
      ]);
    },
  }))
);
