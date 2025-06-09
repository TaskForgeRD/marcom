// hooks/useStatsData.ts - Fixed filter functionality
import { useMemo } from "react";
import { useFilterStore } from "@/stores/useFilterStore";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import { useSocket } from "@/hooks/useSocket";
import dayjs from "dayjs";
import { formatPresetLabel } from "@/lib/utils/dateUtils";
import { getFilteredStats, formatChange } from "@/lib/utils/statsUtils";

export const useStatsData = () => {
  const { selectedPreset, filters } = useFilterStore();
  const filteredMateri = useFilteredMateri();
  const { stats: socketStats, loading: socketLoading, error: socketError, refreshStats } = useSocket();

  const dateRange = filters?.start_date && filters?.end_date ? { 
    from: new Date(filters.start_date), 
    to: new Date(filters.end_date) 
  } : undefined;

  const waktuLabel = formatPresetLabel(selectedPreset, dateRange);

  const getMonthlyChartData = (filterFn: (m: any) => boolean) => {
    const months = Array.from({ length: 12 }).map((_, idx) => {
      const month = dayjs().month(idx);
      const itemsInMonth = filteredMateri.filter(
        (m: { start_date: string | number | Date | dayjs.Dayjs | null | undefined; }) => dayjs(m.start_date).month() === idx && filterFn(m)
      );
      return {
        name: month.format("MMM"),
        value: itemsInMonth.length,
      };
    });
    return months;
  };

  const stats = useMemo(() => {
    // SOLUTION 1: Always use filtered data for accurate filtering
    // Remove socket stats dependency for filtered results
    const baseStats = {
      total: getFilteredStats(filteredMateri, () => true, dateRange),
      fitur: getFilteredStats(filteredMateri, (m) => m.fitur, dateRange, (m) => m.fitur?.trim().toLowerCase()),
      komunikasi: getFilteredStats(filteredMateri, (m) => m.nama_materi, dateRange),
      aktif: getFilteredStats(filteredMateri, (m) => dayjs().isBefore(m.end_date), dateRange),
      expired: getFilteredStats(filteredMateri, (m) => dayjs().isAfter(m.end_date), dateRange),
      dokumen: getFilteredStats(filteredMateri, (m) => m.dokumenMateri?.length > 0, dateRange)
    };

    // Add chart data
    return {
      total: { ...baseStats.total, chartData: [] },
      fitur: { 
        ...baseStats.fitur, 
        chartData: getMonthlyChartData((m) => m.fitur) 
      },
      komunikasi: { 
        ...baseStats.komunikasi, 
        chartData: getMonthlyChartData((m) => m.nama_materi) 
      },
      aktif: { 
        ...baseStats.aktif, 
        chartData: getMonthlyChartData((m) => dayjs().isBefore(m.end_date)) 
      },
      expired: { 
        ...baseStats.expired, 
        chartData: getMonthlyChartData((m) => dayjs().isAfter(m.end_date)) 
      },
      dokumen: { 
        ...baseStats.dokumen, 
        chartData: getMonthlyChartData((m) => m.dokumenMateri?.length > 0) 
      },
    };
  }, [filteredMateri, dateRange]); // Remove socketStats dependency

  return {
    selectedPreset,
    waktuLabel,
    loading: socketLoading,
    error: socketError,
    lastUpdated: socketStats?.lastUpdated, // Keep socket info for real-time indicators
    refreshStats,
    stats: Object.fromEntries(
      Object.entries(stats).map(([key, val]) => [
        key,
        {
          ...val,
          changeLabel: formatChange(val.change),
        },
      ])
    ) as Record<string, typeof stats.total & { 
      changeLabel: string; 
      chartData: { name: string; value: number }[] 
    }>,
  };
};