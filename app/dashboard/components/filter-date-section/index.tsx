"use client";

import * as React from "react";
import useDateRange from "@/hooks/useDateRange";
import CustomDateDropdown from "@/app/dashboard/uiRama/custom-date-dropdown";
import CustomDatePopover from "@/app/dashboard/uiRama/custom-date-range";
import { useMultiApiStore } from "@/stores/api.store";
import { useFilterStore } from "@/stores/filter-materi.store";
import { FilterKey } from "@/constants/filter-options";
import SelectField from "../../uiRama/selectField";
import useSelectedFilters from "@/hooks/useSelectedFilters";
import { useSocket } from "@/hooks/useSocket";
import { PresetDate } from "@/constants/preset-date";

const FilterDateSection: React.FC = () => {
  const { brands } = useMultiApiStore();
  const { setTempFilter, applyFilters, setSelectedPreset } = useFilterStore();
  const { refreshStats } = useSocket();

  const { selectedFilters, handleFilterChange } = useSelectedFilters();

  const { dateRange, isCustomRange, handleDateChange, handlePresetSelection, setIsCustomRange } =
    useDateRange({
      onApply: refreshStats,
    });

  const filterOptions: Partial<Record<FilterKey, string[]>> = {
    brand: ["Semua Brand", ...brands.map((brand) => brand.name)],
  };
  const filterKeys: FilterKey[] = ["brand"];

  const handleBrandChange = async (value: string) => {
    // 1) Update UI state
    handleFilterChange("brand", value);

    // 2) Persist brand to temp filters first
    if (value === "Semua Brand") {
      setTempFilter("brand", "");
    } else {
      setTempFilter("brand", value);
    }

    // 3) Reset DATE to default (All time) via preset handler to update date UI state
    setSelectedPreset(PresetDate.ALL_TIME);
    setIsCustomRange(false);
    handlePresetSelection(PresetDate.ALL_TIME); // this applies filters and triggers onApply → refreshStats

    // Note: do not call applyFilters()/refreshStats() here to avoid double apply
  };

  // Wrap date handlers to reset BRAND to default when date changes
  const onPresetSelectWithBrandReset = (preset: PresetDate) => {
    // Reset brand to default in UI and store
    handleFilterChange("brand", "Semua Brand");
    setTempFilter("brand", "");

    // Proceed with original handler
    handlePresetSelection(preset);
  };

  const onDateChangeWithBrandReset = (range: any) => {
    // Reset brand to default in UI and store
    handleFilterChange("brand", "Semua Brand");
    setTempFilter("brand", "");

    // Proceed with original handler
    handleDateChange(range);
  };

  // Hapus efek otomatis: apply dilakukan oleh useDateRange.onApply

  return (
    <section className="flex items-center space-x-2 py-4 pl-4">
      <span className="text-sm text-gray-700">Lihat data selama</span>
      <CustomDateDropdown
        dateRange={dateRange}
        highlightDropdown={true}
        isCustomRange={isCustomRange}
        handlePresetSelection={onPresetSelectWithBrandReset}
      />
      {isCustomRange && (
        <CustomDatePopover
          dateRange={dateRange}
          handleDateChange={onDateChangeWithBrandReset}
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
