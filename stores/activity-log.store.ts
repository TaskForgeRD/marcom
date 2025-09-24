import { create } from "zustand";

export interface ActivityLog {
  id: number;
  user_id?: number;
  action_type: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW" | "UPLOAD" | "DOWNLOAD" | "APPROVE" | "REJECT";
  resource_type: string;
  resource_id?: number;
  resource_name?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface ActivityLogFilter {
  user_id?: number;
  action_type?: ActivityLog["action_type"];
  resource_type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityLogStats {
  total_actions: number;
  active_users?: number;
  actions_by_type: { action_type: ActivityLog["action_type"]; count: number }[];
  actions_by_resource?: { resource_type: string; count: number }[];
  daily_activity?: { date: string; count: number }[];
  recent_activity: ActivityLog[];
}

interface ActivityLogStore {
  // State
  logs: ActivityLog[];
  currentLog: ActivityLog | null;
  userStats: ActivityLogStats | null;
  systemStats: ActivityLogStats | null;
  actionTypes: ActivityLog["action_type"][];
  
  // Pagination
  total: number;
  currentPage: number;
  limit: number;
  
  // Filters
  filters: ActivityLogFilter;
  
  // Loading states
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingLog: boolean;
  
  // Error state
  error: string | null;

  // Actions
  setFilters: (filters: Partial<ActivityLogFilter>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // API Actions
  fetchLogs: () => Promise<void>;
  fetchLogById: (id: number) => Promise<void>;
  fetchUserStats: (userId?: number, days?: number) => Promise<void>;
  fetchSystemStats: (days?: number) => Promise<void>;
  fetchActionTypes: () => Promise<void>;
  fetchSummary: (days?: number) => Promise<void>;
  
  // Utility actions
  reset: () => void;
  clearError: () => void;
}

const initialFilters: ActivityLogFilter = {
  limit: 50,
  offset: 0,
};

export const useActivityLogStore = create<ActivityLogStore>((set, get) => ({
  // Initial state
  logs: [],
  currentLog: null,
  userStats: null,
  systemStats: null,
  actionTypes: [],
  
  total: 0,
  currentPage: 1,
  limit: 50,
  
  filters: initialFilters,
  
  isLoading: false,
  isLoadingStats: false,
  isLoadingLog: false,
  
  error: null,

  // Filter actions
  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ 
      filters,
      currentPage: 1,
      filters: { ...filters, offset: 0 }
    });
  },

  clearFilters: () => {
    set({ 
      filters: initialFilters,
      currentPage: 1 
    });
  },

  setPage: (page) => {
    const { limit } = get();
    set({ 
      currentPage: page,
      filters: { ...get().filters, offset: (page - 1) * limit }
    });
  },

  setLimit: (limit) => {
    set({ 
      limit,
      currentPage: 1,
      filters: { ...get().filters, limit, offset: 0 }
    });
  },

  // API Actions
  fetchLogs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters } = get();
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/activity-logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      const data = await response.json();
      
      if (data.success) {
        set({
          logs: data.data,
          total: data.pagination.total,
          currentPage: Math.floor(filters.offset! / filters.limit!) + 1,
        });
      } else {
        throw new Error(data.message || 'Failed to fetch activity logs');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLogById: async (id) => {
    set({ isLoadingLog: true, error: null });
    
    try {
      const response = await fetch(`/api/activity-logs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity log');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ currentLog: data.data });
      } else {
        throw new Error(data.message || 'Failed to fetch activity log');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoadingLog: false });
    }
  },

  fetchUserStats: async (userId, days = 30) => {
    set({ isLoadingStats: true, error: null });
    
    try {
      const endpoint = userId 
        ? `/api/activity-logs/stats/user/${userId}?days=${days}`
        : `/api/activity-logs/stats/me?days=${days}`;
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activity stats');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ userStats: data.data });
      } else {
        throw new Error(data.message || 'Failed to fetch user activity stats');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoadingStats: false });
    }
  },

  fetchSystemStats: async (days = 30) => {
    set({ isLoadingStats: true, error: null });
    
    try {
      const response = await fetch(`/api/activity-logs/stats/system?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system activity stats');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ systemStats: data.data });
      } else {
        throw new Error(data.message || 'Failed to fetch system activity stats');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoadingStats: false });
    }
  },

  fetchActionTypes: async () => {
    try {
      const response = await fetch('/api/activity-logs/action-types', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch action types');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ actionTypes: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch action types:', error);
    }
  },

  fetchSummary: async (days = 7) => {
    set({ isLoadingStats: true, error: null });
    
    try {
      const response = await fetch(`/api/activity-logs/summary?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity summary');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ 
          userStats: data.data.user_stats,
          systemStats: data.data.system_stats
        });
      } else {
        throw new Error(data.message || 'Failed to fetch activity summary');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoadingStats: false });
    }
  },

  // Utility actions
  reset: () => {
    set({
      logs: [],
      currentLog: null,
      userStats: null,
      systemStats: null,
      total: 0,
      currentPage: 1,
      filters: initialFilters,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

