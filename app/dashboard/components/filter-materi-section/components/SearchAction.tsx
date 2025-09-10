"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useFilterStore } from "@/stores/filter-materi.store";
import SearchInput from "@/app/dashboard/uiRama/searchInput";

const SearchAndActions = () => {
  const [searchValue, setSearchValue] = useState("");
  const { setSearchQuery } = useFilterStore();

  const debouncedSearch = useDebounce(searchValue, 500);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      // Hanya update filter; biarkan TableMateriSection yang melakukan fetch
      setSearchQuery(searchTerm);
    },
    [setSearchQuery]
  );

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
