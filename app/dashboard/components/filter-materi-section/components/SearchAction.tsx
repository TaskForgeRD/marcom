"use client";

// SearchAction.tsx - Updated to work with server-side pagination and Socket stats
import React, { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "@/stores/filter-materi.store";
import SearchInput from "@/app/dashboard/uiRama/searchInput";

const SearchAndActions = () => {
  const [searchValue, setSearchValue] = useState("");
  const { fetchData } = useMateri();
  const { setSearchQuery } = useFilterStore();

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchValue, 500);

  // Handle search with debounced value
  const handleSearch = useCallback(
    async (searchTerm: string) => {
      const newFilters = setSearchQuery(searchTerm);
      // Fetch data with new search, reset to page 1
      // Note: Stats will be automatically updated via useStatsData hook when search query changes
      await fetchData(1, newFilters);
    },
    [setSearchQuery, fetchData]
  );

  // Apply debounced search
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch, handleSearch]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="flex items-center w-full">
      <div className="flex-1 min-w-0 max-w-[600px]">
        <SearchInput
          placeholder="Cari Materi Komunikasi"
          value={searchValue}
          onChange={handleSearchChange}
          className="w-126"
        />
      </div>
    </div>
  );
};

export default SearchAndActions;
