"use client";

import React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PresetDate } from "../../../constants/preset-date";
import { useFilterStore } from "@/store/useFilterStore";

interface CustomDateDropdownProps {
  dateRange?: { from: Date; to: Date };
  isCustomRange: boolean;
  handlePresetSelection: (preset: PresetDate) => void; 
}

const CustomDateDropdown: React.FC<CustomDateDropdownProps> = ({ dateRange, isCustomRange, handlePresetSelection }) => {
  const { setSelectedPreset } = useFilterStore();

  const handlePresetClick = (preset: PresetDate) => {
    setSelectedPreset(preset);
    handlePresetSelection(preset); 
  };

  const displayLabel = () => {
    if (isCustomRange) return "Pilih tanggal tertentu";
    if (!dateRange?.from) return "All time";
    if (dateRange.to) return `${format(dateRange.from, "d MMM y")} - ${format(dateRange.to, "d MMM y")}`;
    return format(dateRange.from, "d MMM y");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[260px] justify-between">
          {displayLabel()}
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px]">
        {Object.values(PresetDate).map((preset) => (
          <DropdownMenuItem key={preset} onClick={() => handlePresetClick(preset)}>
            {preset}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDateDropdown;
