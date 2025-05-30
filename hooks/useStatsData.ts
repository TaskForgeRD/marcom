// hooks/useStatsData.ts - Updated to use Socket.IO
import { useMemo } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import { useSocket } from "@/hooks/useSocket";
import dayjs from "dayjs";
import { formatPresetLabel } from "@/lib/utils/dateUtils";
import { getFilteredStats, formatChange } from "@/lib/utils/statsUtils";

export const useStatsData = () => {
  const { selectedPreset, filters } = useFilterStore();
  const filteredMateri = useFilteredMateri();
  const { stats: socketStats, loading: socketLoading, error: socketError, refreshStats } = useSocket();

  const dateRange = filters?.startDate && filters?.endDate ? { 
    from: new Date(filters.startDate), 
    to: new Date(filters.endDate) 
  } : undefined;

  const waktuLabel = formatPresetLabel(selectedPreset, dateRange);

  const getMonthlyChartData = (filterFn: (m: any) => boolean) => {
    const months = Array.from({ length: 12 }).map((_, idx) => {
      const month = dayjs().month(idx);
      const itemsInMonth = filteredMateri.filter(
        (m) => dayjs(m.startDate).month() === idx && filterFn(m)
      );
      return {
        name: month.format("MMM"),
        value: itemsInMonth.length,
      };
    });
    return months;
  };

  const stats = useMemo(() => {
    // Use socket stats as base if available, otherwise calculate from filtered data
    const baseStats = socketStats ? {
      total: { now: socketStats.total, change: 0 },
      fitur: { now: socketStats.fitur, change: 0 },
      komunikasi: { now: socketStats.komunikasi, change: 0 },
      aktif: { now: socketStats.aktif, change: 0 },
      expired: { now: socketStats.expired, change: 0 },
      dokumen: { now: socketStats.dokumen, change: 0 }
    } : {
      total: getFilteredStats(filteredMateri, () => true, dateRange),
      fitur: getFilteredStats(filteredMateri, (m) => m.fitur, dateRange, (m) => m.fitur?.trim().toLowerCase()),
      komunikasi: getFilteredStats(filteredMateri, (m) => m.namaMateri, dateRange),
      aktif: getFilteredStats(filteredMateri, (m) => dayjs().isBefore(m.endDate), dateRange),
      expired: getFilteredStats(filteredMateri, (m) => dayjs().isAfter(m.endDate), dateRange),
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
        chartData: getMonthlyChartData((m) => m.namaMateri) 
      },
      aktif: { 
        ...baseStats.aktif, 
        chartData: getMonthlyChartData((m) => dayjs().isBefore(m.endDate)) 
      },
      expired: { 
        ...baseStats.expired, 
        chartData: getMonthlyChartData((m) => dayjs().isAfter(m.endDate)) 
      },
      dokumen: { 
        ...baseStats.dokumen, 
        chartData: getMonthlyChartData((m) => m.dokumenMateri?.length > 0) 
      },
    };
  }, [filteredMateri, dateRange, socketStats]);

  return {
    selectedPreset,
    waktuLabel,
    loading: socketLoading,
    error: socketError,
    lastUpdated: socketStats?.lastUpdated,
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