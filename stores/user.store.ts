import { create } from "zustand";
import { logger } from "../middleware/logger";

// Types
export type Role = "superadmin" | "admin" | "guest";

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  role?: Role;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  users?: User[];
  user?: User;
}

interface UserStore {
  // Data states
  users: User[];
  loading: boolean;

  // Actions
  fetchUsers: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const raw = localStorage.getItem("marcom-auth-store");
  return raw ? JSON.parse(raw)?.state?.token : null;
};

// Helper function for API requests
const makeApiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<ApiResponse> => {
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

export const useUserStore = create<UserStore>()(
  logger((set, get) => ({
    // Initial states
    users: [],
    loading: false,

    // Actions
    fetchUsers: async () => {
      set({ loading: true });
      try {
        const result = await makeApiRequest("/users");
        console.log("Fetched users:", result.users);
        if (result.success && result.users) {
          set({ users: result.users, loading: false });
        } else {
          throw new Error(result.message || "Gagal mengambil data pengguna");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        set({ loading: false });
        throw error;
      }
    },

    createUser: async (userData: Partial<User>) => {
      try {
        const result = await makeApiRequest("/users", "POST", userData);
        if (result.success) {
          await get().fetchUsers(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal menambahkan pengguna");
        }
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },

    updateUser: async (id: number, userData: Partial<User>) => {
      try {
        const result = await makeApiRequest(`/users/${id}`, "PUT", userData);
        if (result.success) {
          await get().fetchUsers(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal memperbarui pengguna");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    deleteUser: async (id: number) => {
      try {
        const result = await makeApiRequest(`/users/${id}`, "DELETE");
        if (result.success) {
          await get().fetchUsers(); // Refresh data
        } else {
          throw new Error(result.message || "Gagal menghapus pengguna");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
  }))
);
