export type Filters = {
    brand?: string;
    cluster?: string;
    fitur?: string;
    status?: string;
    jenis?: string;
    start_date?: string;
    end_date?: string;
  };
  
  export interface FilterStore {
    filters: Filters;
    tempFilters: Filters;
    searchQuery: string;
    selectedPreset: string;
    setTempFilter: (key: keyof Filters, value: string) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedPreset: (preset: string) => void;
  }
  