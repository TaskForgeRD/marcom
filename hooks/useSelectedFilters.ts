import { useState } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import { FilterKey } from "@/constants/filter-options";

export default function useSelectedFilters() {
  const { setTempFilter, resetFilters } = useFilterStore();

  const [selectedFilters, setSelectedFilters] = useState<
    Partial<Record<FilterKey, string>>
  >({});

  const handleFilterChange = (key: FilterKey, value: string) => {
    // Untuk store filter, tetap kirim empty string jika "Semua"
    const filterValue =
      value.startsWith("Semua") || value === "Semua Status" ? "" : value;
    setTempFilter(key, filterValue);

    // Untuk UI state, simpan value asli untuk ditampilkan
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    resetFilters();
    setSelectedFilters({});
  };

  return { selectedFilters, handleFilterChange, handleResetFilters };
}
