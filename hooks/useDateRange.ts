import React from "react";
import { PresetDate } from "../constants/preset-date";
import { useFilterStore } from "@/stores/filter-materi.store";
import { DateRange } from "react-day-picker";

type UseDateProps = {
  onApply?: () => void;
};

const useDateRange = (props?: UseDateProps) => {
  const { tempFilters, setTempFilter, applyFilters } = useFilterStore();
  const today = React.useMemo(() => new Date(), []);

  const [dateRange, setDateRange] = React.useState<
    { from: Date; to: Date } | undefined
  >(
    tempFilters.start_date && tempFilters.end_date
      ? {
          from: new Date(tempFilters.start_date),
          to: new Date(tempFilters.end_date),
        }
      : undefined
  );

  const [isCustomRange, setIsCustomRange] = React.useState(false);

  const presetRanges: Record<PresetDate, { from: Date; to: Date } | null> = {
    [PresetDate.ALL_TIME]: null,
    [PresetDate.CUSTOM]: null,
    [PresetDate.THIS_MONTH]: {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth() + 1, 0), // Last day of current month
    },
    [PresetDate.LAST_MONTH]: {
      from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      to: new Date(today.getFullYear(), today.getMonth(), 0),
    },
    [PresetDate.THIS_YEAR]: {
      from: new Date(today.getFullYear(), 0, 1), // 1 Januari tahun ini
      to: new Date(today.getFullYear(), 11, 31), // 31 Desember tahun ini
    },
  };

  const handleDateChange = React.useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setDateRange(undefined);
        setTempFilter("start_date", "");
        setTempFilter("end_date", "");
      } else {
        const endDate = range.to ?? range.from;
        setDateRange({ from: range.from, to: endDate });
        setTempFilter("start_date", range.from.toISOString());
        setTempFilter("end_date", endDate.toISOString());
      }
      applyFilters();
      props?.onApply?.();
    },
    [setTempFilter, applyFilters]
  );

  const handlePresetSelection = (preset: PresetDate) => {
    if (preset === PresetDate.CUSTOM) {
      setIsCustomRange(true);
      return;
    }

    setIsCustomRange(false);

    if (preset === PresetDate.ALL_TIME) {
      setDateRange(undefined);
      setTempFilter("start_date", "");
      setTempFilter("end_date", "");
    } else {
      const range = presetRanges[preset];
      if (range) {
        setDateRange(range);
        setTempFilter("start_date", range.from.toISOString());
        setTempFilter("end_date", range.to.toISOString());
      }
    }

    applyFilters();
    props?.onApply?.();
  };

  return {
    dateRange,
    isCustomRange,
    handleDateChange,
    handlePresetSelection,
    setIsCustomRange,
  };
};

export default useDateRange;
