// hooks/useStatsData.ts - Updated to keep stats UNFILTERED
import { useMemo, useEffect } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
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

  const {
    stats: socketStats,
    loading: socketLoading,
    error: socketError,
    refreshStats,
    // Remove filtered stats functions - we don't need them anymore
  } = useSocket();

  // Build current filters for display/debugging purposes only
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

    return Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value !== undefined)
    );
  }, [filters, searchQuery, onlyVisualDocs]);

  // Check if any filters are applied (for display purposes)
  const hasFilters = useMemo(() => {
    return Object.keys(currentFilters).length > 0;
  }, [currentFilters]);

  // CHANGED: Always request unfiltered stats, regardless of filters
  useEffect(() => {
    console.log("Stats hook effect - always requesting unfiltered stats");
    refreshStats(); // Always get unfiltered stats
  }, []); // Empty dependency array - only run once on mount

  // Optional: Refresh stats when onlyVisualDocs changes (if you want this specific filter to affect stats)
  // Remove this useEffect if you want stats to be completely unaffected by any filters
  useEffect(() => {
    if (onlyVisualDocs !== undefined) {
      console.log("OnlyVisualDocs changed, refreshing stats");
      refreshStats();
    }
  }, [onlyVisualDocs, refreshStats]);

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

  // Process stats data from Socket (always unfiltered data)
  const stats = useMemo(() => {
    if (!socketStats) {
      // Default stats when no data
      const defaultStat = {
        now: 0,
        change: 0,
        changeLabel: "0",
        chartData: [],
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

    // Process stats with chart data from Socket (unfiltered)
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

  // Custom refresh function that always gets unfiltered stats
  const handleRefreshStats = () => {
    console.log("Manually refreshing unfiltered stats");
    refreshStats(); // Always unfiltered
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
    hasFilters, // For display purposes
    // appliedFilters: socketStats?.appliedFilters || {}, // Will be empty since we don't use filtered stats
    currentFilters, // For display/debugging
    stats, // Always unfiltered
  };
};
