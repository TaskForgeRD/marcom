"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface CustomDateRangeProps {
  dateRange?: { from: Date; to: Date };
  handleDateChange: (range: any) => void;
}

const CustomDateRange: React.FC<CustomDateRangeProps> = ({ dateRange, handleDateChange }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="ml-2">
        Periode Data
        <CalendarIcon className="mr-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={handleDateChange}
        numberOfMonths={2}
      />
    </PopoverContent>
  </Popover>
);

export default CustomDateRange;
