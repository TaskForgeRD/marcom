// hooks/useStatsData.ts - Simplified to use Socket API directly
import { useMemo, useEffect } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useSocket } from "@/hooks/useSocket";
import { formatPresetLabel } from "@/lib/utils/dateUtils";
import { formatChange } from "@/lib/utils/statsUtils";

export const useStatsData = () => {
  const {
    selectedPreset,
    filters,
    searchQuery,
    onlyVisualDocs,
    applyFilters,
    setTempFilter,
  } = useFilterStore();

  const {
    stats: socketStats,
    loading: socketLoading,
    error: socketError,
    refreshStats,
    requestFilteredStats,
    refreshFilteredStats,
  } = useSocket();

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

  // Process stats data from Socket
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
        fitur: defaultStat,
        komunikasi: defaultStat,
        aktif: defaultStat,
        expired: defaultStat,
        dokumen: defaultStat,
      };
    }

    // Use stats directly from Socket (already filtered if filters were applied)
    const processedStats = {
      total: {
        now: socketStats.total || 0,
        change: 0, // Socket doesn't provide change data yet
        changeLabel: "0",
        chartData: [], // Could be populated later if needed
      },
      fitur: {
        now: socketStats.fitur || 0,
        change: 0,
        changeLabel: "0",
        chartData: [],
      },
      komunikasi: {
        now: socketStats.komunikasi || 0,
        change: 0,
        changeLabel: "0",
        chartData: [],
      },
      aktif: {
        now: socketStats.aktif || 0,
        change: 0,
        changeLabel: "0",
        chartData: [],
      },
      expired: {
        now: socketStats.expired || 0,
        change: 0,
        changeLabel: "0",
        chartData: [],
      },
      dokumen: {
        now: socketStats.dokumen || 0,
        change: 0,
        changeLabel: "0",
        chartData: [],
      },
    };

    return processedStats;
  }, [socketStats]);

  // Custom refresh function that respects current filters
  const handleRefreshStats = () => {
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
    refreshStats: handleRefreshStats, // Use custom refresh function
    hasFilters, // Expose this for debugging
    appliedFilters: socketStats?.appliedFilters, // For debugging
    currentFilters, // Expose current filters
    stats,
  };
};
