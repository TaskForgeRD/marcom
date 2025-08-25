// hooks/useStatsData.ts - Updated to include API fitur data
import { useMemo, useEffect } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useMultiApiStore } from "@/stores/api.store";
import { useSocket } from "@/hooks/useSocket";
import { formatPresetLabel } from "@/lib/utils/dateUtils";

export const useStatsData = () => {
  const {
    selectedPreset,
    filters,
    searchQuery,
    onlyVisualDocs,
    applyFilters,
    setTempFilter,
  } = useFilterStore();

  // Get fitur data from API store
  const { fitur, fetchFitur } = useMultiApiStore();

  const {
    stats: socketStats,
    loading: socketLoading,
    error: socketError,
    refreshStats,
    requestFilteredStats,
    refreshFilteredStats,
  } = useSocket();

  // Fetch fitur data when component mounts
  useEffect(() => {
    if (fitur.length === 0) {
      fetchFitur();
    }
  }, [fitur.length, fetchFitur]);

  // Build current filters for Socket
  const currentFilters = useMemo(() => {
    const filterParams = {
      brand: filters.brand || undefined,
      cluster: filters.cluster || undefined,
      fitur: filters.fitur || undefined,
      jenis: filters.jenis || undefined,
      status: filters.status || undefined,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      search: searchQuery || undefined,
      onlyVisualDocs: onlyVisualDocs || undefined,
    };

    // Remove undefined values
    return Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value !== undefined)
    );
  }, [filters, searchQuery, onlyVisualDocs]);

  // Check if any filters are applied
  const hasFilters = useMemo(() => {
    return Object.keys(currentFilters).length > 0;
  }, [currentFilters]);

  // Request filtered stats when filters change
  useEffect(() => {
    if (hasFilters) {
      console.log(
        "Filters changed, requesting filtered stats:",
        currentFilters
      );
      requestFilteredStats(currentFilters);
    } else {
      console.log("No filters applied, requesting normal stats");
      refreshStats();
    }
  }, [currentFilters, hasFilters, requestFilteredStats, refreshStats]);

  // Format date range for display
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
          now: fitur.length, // Use API fitur count as default
        },
        komunikasi: defaultStat,
        aktif: defaultStat,
        expired: defaultStat,
        dokumen: defaultStat,
      };
    }

    // Process stats with chart data from Socket
    const processedStats = {
      total: {
        now: socketStats.total || 0,
        change: 0, // Socket doesn't provide change data yet
        changeLabel: "0",
        chartData: socketStats.chartData?.total || [],
      },
      fitur: {
        now: fitur.length, // Always use API fitur count
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
  }, [socketStats, fitur.length]);

  // Custom refresh function that respects current filters
  const handleRefreshStats = () => {
    // Always refresh fitur data from API
    fetchFitur();

    if (hasFilters) {
      refreshFilteredStats(currentFilters);
    } else {
      refreshStats();
    }
  };

  return {
    selectedPreset,
    waktuLabel,
    loading: socketLoading,
    error: socketError,
    applyFilters,
    setTempFilter,
    filters,
    lastUpdated: socketStats?.lastUpdated,
    refreshStats: handleRefreshStats,
    hasFilters,
    appliedFilters: socketStats?.appliedFilters,
    currentFilters,
    stats,
    // Expose fitur data for debugging
    fiturData: fitur,
    totalFitur: fitur.length,
  };
};
