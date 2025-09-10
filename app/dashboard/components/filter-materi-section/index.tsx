// FilterOption.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useMultiApiStore } from "@/stores/api.store";
import useSelectedFilters from "@/hooks/useSelectedFilters";
import HorizontalLine from "@/app/dashboard/uiRama/horizontalLine";
import FilterGroup from "@/app/dashboard/components/filter-materi-section/components/FilterGroup";
import SearchAndActions from "@/app/dashboard/components/filter-materi-section/components/SearchAction";

export default function FilterOption() {
  const { applyFilters, setSearchQuery } = useFilterStore();
  const { fetchAllData } = useMultiApiStore();
  const router = useRouter();
  const { selectedFilters, handleFilterChange, handleResetFilters } =
    useSelectedFilters();

  // Fetch data saat komponen mount
  useEffect(() => {
    fetchAllData();
  }, []); // Remove fetchAllData from dependency array

  return (
    <div className="pt-4 pr-8 pb-4 pl-8 bg-slate-100 space-y-4">
      <FilterGroup
        selectedFilters={selectedFilters}
        handleFilterChange={handleFilterChange}
        handleResetFilters={handleResetFilters}
        applyFilters={applyFilters}
      />
      <HorizontalLine />
      <SearchAndActions
      // handleTambahMateri={() => router.push("/dashboard/form-materi")}
      // setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
