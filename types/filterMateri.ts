export type Filters = {
  brand?: string;
  cluster?: string;
  fitur?: string;
  status?: string;
  jenis?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  onlyVisualDocs?: boolean;
};

export interface FilterStore {
  filters: Record<string, any>;
  tempFilters: Record<string, any>;
  searchQuery: string;
  selectedPreset: string;
  onlyVisualDocs: boolean;

  setTempFilter: (key: string, value: any) => void;
  applyFilters: () => Record<string, any>;
  resetFilters: () => Record<string, any>;
  setSearchQuery: (query: string) => Record<string, any>;
  setStatusQuery: (status: "Aktif" | "Expired") => Record<string, any>;
  setSelectedPreset: (preset: string) => void;
  setOnlyVisualDocs: (value: boolean) => Record<string, any>;
  getCurrentFilters: () => Record<string, any>;
  getOnlyFilters: () => Record<string, any>;
  getTempFilters: () => Record<string, any>;
}
