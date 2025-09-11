// hooks/useStatsData.ts - Updated to reflect current brand/date filters
import { useMemo, useEffect } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useMultiApiStore } from "@/stores/api.store";
import { useSocket } from "@/hooks/useSocket";
import { formatPresetLabel } from "@/lib/utils/dateUtils";

export const useStatsData = () => {
  const { selectedPreset, filters } = useFilterStore();

  // Get fitur data from API store
  const { fitur, fetchFitur } = useMultiApiStore();

  const { stats: socketStats, loading: socketLoading, error: socketError, refreshStats } = useSocket();

  // Fetch fitur data when component mounts
  useEffect(() => {
    if (fitur.length === 0) {
      fetchFitur();
    }
  }, [fitur.length]); // Remove fetchFitur from dependency array

  // Request stats on component mount (will include current filters via socket hook)
  useEffect(() => {
    refreshStats();
  }, []); // Only once on mount

  // Format date range for display (for preset label only)
  const dateRange = useMemo(() => {
    if (filters?.start_date && filters?.end_date) {
      return {
        from: new Date(filters.start_date),
        to: new Date(filters.end_date),
      };
    }
    return undefined;
  }, [filters]);

  const waktuLabel = formatPresetLabel(selectedPreset, dateRange);

  // Process stats data from Socket with API fitur override
  const stats = useMemo(() => {
    if (!socketStats) {
      // Default stats when no data
      const defaultStat = {
        now: 0,
        change: 0,
        changeLabel: "0",
        chartData: [], // Empty chart data
      };

      return {
        total: defaultStat,
        fitur: {
          ...defaultStat,
          now: 0,
        },
        komunikasi: defaultStat,
        aktif: defaultStat,
        expired: defaultStat,
        dokumen: defaultStat,
      };
    }

    // Process stats with chart data from Socket (already filtered server-side if filters provided)
    const processedStats = {
      total: {
        now: socketStats.total || 0,
        change: 0,
        changeLabel: "0",
        chartData: socketStats.chartData?.total || [],
      },
      fitur: {
        now: socketStats.fitur || 0,
        change: 0,
        changeLabel: "0",
        chartData: socketStats.chartData?.fitur || [],
      },
      komunikasi: {
        now: socketStats.komunikasi || 0,
        change: 0,
        changeLabel: "0",
        chartData: socketStats.chartData?.komunikasi || [],
      },
      aktif: {
        now: socketStats.aktif || 0,
        change: 0,
        changeLabel: "0",
        chartData: socketStats.chartData?.aktif || [],
      },
      expired: {
        now: socketStats.expired || 0,
        change: 0,
        changeLabel: "0",
        chartData: socketStats.chartData?.expired || [],
      },
      dokumen: {
        now: socketStats.dokumen || 0,
        change: 0,
        changeLabel: "0",
        chartData: socketStats.chartData?.dokumen || [],
      },
    };

    return processedStats;
  }, [socketStats]);

  // Custom refresh function that always gets unfiltered data
  const handleRefreshStats = () => {
    // Always refresh fitur data from API
    fetchFitur();

    // Always request unfiltered stats
    refreshStats();
  };

  return {
    selectedPreset,
    waktuLabel,
    loading: socketLoading,
    error: socketError,
    lastUpdated: socketStats?.lastUpdated,
    refreshStats: handleRefreshStats,
    stats,
    // Expose fitur data length if needed elsewhere
    fiturData: fitur,
    totalFitur: socketStats?.fitur ?? 0,
  };
};
