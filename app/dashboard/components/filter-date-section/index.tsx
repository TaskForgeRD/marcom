"use client";

import * as React from "react";
import useDateRange from "@/hooks/useDateRange";
import CustomDateDropdown from "@/app/dashboard/uiRama/custom-date-dropdown";
import CustomDatePopover from "@/app/dashboard/uiRama/custom-date-range";
import { useMultiApiStore } from "@/stores/api.store";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "@/stores/filter-materi.store";
import { FilterKey } from "@/constants/filter-options";
import SelectField from "../../uiRama/selectField";
import useSelectedFilters from "@/hooks/useSelectedFilters";
import { useSocket } from "@/hooks/useSocket";

const FilterDateSection: React.FC = () => {
  const { brands } = useMultiApiStore();
  const { fetchData } = useMateri();
  const { setTempFilter, applyFilters, getCurrentFilters } = useFilterStore();
  const { refreshStats } = useSocket();

  const { selectedFilters, handleFilterChange } = useSelectedFilters();

  const { dateRange, isCustomRange, handleDateChange, handlePresetSelection } =
    useDateRange({
      onApply: refreshStats,
    });

  const filterOptions: Partial<Record<FilterKey, string[]>> = {
    brand: ["Semua Brand", ...brands.map((brand) => brand.name)],
  };
  const filterKeys: FilterKey[] = ["brand"];

  const handleBrandChange = async (value: string) => {
    handleFilterChange("brand", value);

    if (value === "Semua Brand") {
      setTempFilter("brand", "");
    } else {
      setTempFilter("brand", value);
    }

    const newFilters = applyFilters();
    refreshStats();
    await fetchData(1, newFilters);
  };

  React.useEffect(() => {
    const applyDateFilters = async () => {
      const currentFilters = getCurrentFilters();
      await fetchData(1, currentFilters);
    };

    if (dateRange || dateRange === undefined) {
      applyDateFilters();
    }
  }, [dateRange]); // Remove function dependencies

  return (
    <section className="flex items-center space-x-2 py-4 pl-4">
      <span className="text-sm text-gray-700">Lihat data selama</span>
      <CustomDateDropdown
        dateRange={dateRange}
        highlightDropdown={true}
        isCustomRange={isCustomRange}
        handlePresetSelection={handlePresetSelection}
      />
      {isCustomRange && (
        <CustomDatePopover
          dateRange={dateRange}
          handleDateChange={handleDateChange}
        />
      )}
      <span className="text-sm font-medium">Dari Brand</span>

      {filterKeys.map((key) => (
        <SelectField
          key={key}
          highlight={true}
          label={key}
          value={selectedFilters[key] || ""}
          onChange={handleBrandChange}
          options={
            filterOptions[key]?.map((opt) => ({
              value: opt,
              label: opt,
            })) || []
          }
          showLabel={false}
        />
      ))}
    </section>
  );
};

export default FilterDateSection;
