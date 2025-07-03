"use client";

import * as React from "react";
import useDateRange from "@/hooks/useDateRange";
import CustomDateDropdown from "@/app/dashboard/uiRama/custom-date-dropdown";
import CustomDatePopover from "@/app/dashboard/uiRama/custom-date-range";

const FilterDateSection: React.FC = () => {
  const { dateRange, isCustomRange, handleDateChange, handlePresetSelection } =
    useDateRange();

  return (
    <section className="flex items-center space-x-2 py-4 pl-4">
      <span className="text-sm text-gray-700">Lihat data selama</span>
      <CustomDateDropdown
        dateRange={dateRange}
        isCustomRange={isCustomRange}
        handlePresetSelection={handlePresetSelection}
      />
      {isCustomRange && (
        <CustomDatePopover
          dateRange={dateRange}
          handleDateChange={handleDateChange}
        />
      )}
    </section>
  );
};

export default FilterDateSection;
