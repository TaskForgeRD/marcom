export type Filters = {
  brand?: string;
  cluster?: string;
  fitur?: string;
  status?: string;
  jenis?: string;
  start_date?: string;
  end_date?: string;
};

// types/filterMateri.ts - Update interface untuk menambahkan onlyVisualDocs
export interface FilterStore {
  filters: Record<string, any>;
  tempFilters: Record<string, any>;
  searchQuery: string;
  selectedPreset: string;
  onlyVisualDocs: boolean; // Tambahkan ini
  setTempFilter: (key: string, value: any) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedPreset: (preset: string) => void;
  setOnlyVisualDocs: (value: boolean) => void; // Tambahkan ini
}
