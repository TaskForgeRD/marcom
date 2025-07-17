"use client";

import * as React from "react";
import useDateRange from "@/hooks/useDateRange";
import CustomDateDropdown from "@/app/dashboard/uiRama/custom-date-dropdown";
import CustomDatePopover from "@/app/dashboard/uiRama/custom-date-range";
import { useMultiApiStore } from "@/stores/api.store";
import { FilterKey } from "@/constants/filter-options";
import SelectField from "../../uiRama/selectField";
import useSelectedFilters from "@/hooks/useSelectedFilters";

const FilterDateSection: React.FC = () => {
  const { brands } = useMultiApiStore();
  const { selectedFilters, handleFilterChange } = useSelectedFilters();

  const { dateRange, isCustomRange, handleDateChange, handlePresetSelection } =
    useDateRange();
  const filterOptions: Partial<Record<FilterKey, string[]>> = {
    brand: ["Semua Brand", ...brands.map((brand) => brand.name)],
  };
  const filterKeys: FilterKey[] = ["brand"];

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
          onChange={(value) => {
            // Jika pilih "Semua", simpan sebagai "Semua [Key]" bukan empty string
            if (value.startsWith("Semua") || value === "Semua Status") {
              handleFilterChange(key, value); // Simpan value asli "Semua Brand", dll
            } else {
              handleFilterChange(key, value);
            }
          }}
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
